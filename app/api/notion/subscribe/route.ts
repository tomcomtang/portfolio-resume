import { NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

type NotionDatabase = {
  properties: Record<
    string,
    {
      name?: string;
      type: string;
    }
  >;
};

let cachedDatabase: NotionDatabase | null = null;

async function getNotionDatabaseSchema(databaseId: string, token: string) {
  if (cachedDatabase) return cachedDatabase;

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to read Notion database schema (${res.status}). ${text}`
    );
  }

  const json = (await res.json()) as NotionDatabase;
  cachedDatabase = json;
  return json;
}

function normalizeName(name: unknown) {
  return typeof name === "string" ? name.trim().toLowerCase() : "";
}

function buildEmailPropertyValue({
  propertyType,
  email,
}: {
  propertyType: string;
  email: string;
}) {
  // Notion property value payload differs by property type.
  if (propertyType === "email") {
    return { email };
  }

  if (propertyType === "rich_text" || propertyType === "text") {
    return {
      rich_text: [
        {
          text: { content: email },
        },
      ],
    };
  }

  if (propertyType === "title") {
    return {
      title: [
        {
          text: { content: email },
        },
      ],
    };
  }

  throw new Error(`Unsupported Notion property type: ${propertyType}`);
}

function buildTextPropertyValue({
  propertyType,
  value,
}: {
  propertyType: string;
  value: string;
}) {
  if (propertyType === "rich_text" || propertyType === "text") {
    return {
      rich_text: [
        {
          text: { content: value },
        },
      ],
    };
  }

  if (propertyType === "title") {
    return {
      title: [
        {
          text: { content: value },
        },
      ],
    };
  }

  // If your DB mistakenly uses select-style properties for "message",
  // we try a best-effort mapping so the submission doesn't fail.
  if (propertyType === "multi_select") {
    return {
      multi_select: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name })),
    };
  }

  if (propertyType === "select") {
    const first = value.split(",")[0]?.trim();
    return { select: { name: first ?? value } };
  }

  throw new Error(`Unsupported Notion text property type: ${propertyType}`);
}

export async function POST(req: Request) {
  const token = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const emailPropertyName = process.env.NOTION_EMAIL_PROPERTY_NAME ?? "email";
  const emailPropertyTypeOverride = process.env.NOTION_EMAIL_PROPERTY_TYPE;
  const idPropertyName = process.env.NOTION_ID_PROPERTY_NAME ?? "id";
  const idPropertyTypeOverride = process.env.NOTION_ID_PROPERTY_TYPE;
  const messagePropertyName =
    process.env.NOTION_MESSAGE_PROPERTY_NAME ?? "message";
  const messagePropertyTypeOverride = process.env.NOTION_MESSAGE_PROPERTY_TYPE;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing NOTION_API_KEY in env." },
      { status: 500 }
    );
  }

  if (!databaseId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Missing NOTION_DATABASE_ID in env. Get it from your Notion database URL.",
      },
      { status: 500 }
    );
  }

  // Expect form-urlencoded from the existing <form />.
  const form = await req.formData();
  const email = form.get("email_address")?.toString().trim();
  const id = form.get("id")?.toString().trim();
  const message = form.get("message")?.toString().trim();

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Missing email_address field." },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing id field." },
      { status: 400 }
    );
  }

  // Basic email sanity check.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email format." },
      { status: 400 }
    );
  }

  if (!message) {
    return NextResponse.json(
      { ok: false, error: "Missing message field." },
      { status: 400 }
    );
  }

  try {
    // Resolve the property type from schema (unless overridden).
    const dbSchema = await getNotionDatabaseSchema(databaseId, token);

    const propertiesEntries = Object.entries(dbSchema.properties) as Array<
      [string, any]
    >;

    // 1) Try match by property "name" (human label)
    const propertyEntry =
      propertiesEntries.find(
        ([, v]) => normalizeName(v?.name) === normalizeName(emailPropertyName)
      ) ??
      propertiesEntries.find(([k]) => k === emailPropertyName);

    // 2) Fallback: if not found, use the first email-type property
    const emailTypeEntry =
      propertyEntry ??
      propertiesEntries.find(([, v]) => (v as any)?.type === "email");

    const propertyKey = emailTypeEntry?.[0] ?? emailPropertyName;
    const resolvedPropertyLabel =
      (emailTypeEntry?.[1] as any)?.name ?? emailPropertyName;
    const propertyType =
      emailPropertyTypeOverride ??
      (dbSchema.properties[propertyKey] as any)?.type;

    if (!resolvedPropertyLabel || !propertyType) {
      return NextResponse.json(
        {
          ok: false,
          error: `Cannot resolve Notion email property for "${emailPropertyName}". Check NOTION_EMAIL_PROPERTY_NAME / NOTION_EMAIL_PROPERTY_TYPE, or ensure your database has an 'email' property.`,
        },
        { status: 500 }
      );
    }

    const emailValue = buildEmailPropertyValue({
      propertyType,
      email,
    });

    // Resolve id property (string stored into a text/title/rich_text property).
    const idEntry =
      propertiesEntries.find(
        ([, v]) => normalizeName(v?.name) === normalizeName(idPropertyName)
      ) ??
      propertiesEntries.find(([k]) => k === idPropertyName) ??
      propertiesEntries.find(([, v]) => {
        const name = (v as any)?.name;
        const type = (v as any)?.type;
        return (
          typeof name === "string" &&
          /id/i.test(name) &&
          (type === "rich_text" || type === "text" || type === "title")
        );
      });

    const idPropertyKey = idEntry?.[0] ?? idPropertyName;
    const resolvedIdLabel =
      (idEntry?.[1] as any)?.name ?? idPropertyName;
    const idPropertyType =
      idPropertyTypeOverride ?? (dbSchema.properties[idPropertyKey] as any)?.type;

    if (!resolvedIdLabel || !idPropertyType) {
      return NextResponse.json(
        {
          ok: false,
          error:
            `Cannot resolve Notion id property. Check NOTION_ID_PROPERTY_NAME / NOTION_ID_PROPERTY_TYPE, or ensure your database has an "ID" (text/title/rich_text) property.`,
        },
        { status: 500 }
      );
    }

    const idValue = buildTextPropertyValue({
      propertyType: idPropertyType,
      value: id,
    });

    // Resolve message property (text/rich_text/title).
    const messageEntry =
      propertiesEntries.find(
        ([, v]) => normalizeName(v?.name) === normalizeName(messagePropertyName)
      ) ??
      propertiesEntries.find(([k]) => k === messagePropertyName);

    const messageTypeEntry =
      messageEntry ??
      propertiesEntries.find(([k, v]) => {
        const type = (v as any)?.type;
        return (
          (type === "rich_text" || type === "text" || type === "title") &&
          k !== propertyKey &&
          k !== idPropertyKey
        );
      });

    const resolvedMessageLabel =
      (messageTypeEntry?.[1] as any)?.name ?? messagePropertyName;
    const messagePropertyKey = messageTypeEntry?.[0] ?? messagePropertyName;
    const messagePropertyType =
      messagePropertyTypeOverride ??
      (dbSchema.properties[messagePropertyKey] as any)?.type;

    if (!resolvedMessageLabel || !messagePropertyType) {
      return NextResponse.json(
        {
          ok: false,
          error:
            `Cannot resolve Notion message property for "${messagePropertyName}". ` +
            `Set NOTION_MESSAGE_PROPERTY_NAME / NOTION_MESSAGE_PROPERTY_TYPE, or ensure your database has a text-like property ("Message").`,
        },
        { status: 500 }
      );
    }

    const messageValue = buildTextPropertyValue({
      propertyType: messagePropertyType,
      value: message,
    });

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          [resolvedPropertyLabel]: emailValue,
          [resolvedIdLabel]: idValue,
          [resolvedMessageLabel]: messageValue,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `Notion write failed (${res.status}). ${text}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

