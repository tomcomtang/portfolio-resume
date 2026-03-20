type Params = {
  params: {
    path?: string[];
  };
};

function stableFakeViews(path: string) {
  // Deterministic hash -> stable "fake" views.
  // This avoids showing all zeros when Firebase isn't configured.
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = (hash * 31 + path.charCodeAt(i)) >>> 0;
  }

  // 500..1200 (never 0, not too "fake" looking)
  return 500 + (hash % 701);
}

function newPage(path: string) {
  return { views: stableFakeViews(path) };
}

async function getFirebase() {
  try {
    const { exists, firestore, pageConverter } = await import(
      "@/utilities/firebaseNode"
    );
    const { FieldValue } = await import("firebase-admin/firestore");
    return { exists, firestore, pageConverter, FieldValue };
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params: { path: segments = [] } }: Params
) {
  const path = "/" + segments.join("/");
  const firebase = await getFirebase();
  if (!firebase) return Response.json(newPage(path));

  const page = await firebase.firestore
    .collection("pages")
    .withConverter(firebase.pageConverter)
    .doc(encodeURIComponent(path))
    .get();

  if (firebase.exists(page)) {
    return Response.json(page.data());
  }

  return Response.json(newPage(path));
}

export async function POST(
  request: Request,
  { params: { path: segments = [] } }: Params
) {
  const path = "/" + segments.join("/");
  const firebase = await getFirebase();
  if (!firebase) return Response.json(newPage(path));

  const page = await firebase.firestore
    .collection("pages")
    .withConverter(firebase.pageConverter)
    .doc(encodeURIComponent(path))
    .get();

  if (firebase.exists(page)) {
    await page.ref.update({
      views: firebase.FieldValue.increment(1),
    });

    return Response.json(page.data());
  } else {
    await page.ref.set(newPage(path));

    return Response.json(newPage(path));
  }
}
