type Params = {
  params: {
    path?: string[];
  };
};

const NEW_PAGE = {
  views: 0,
};

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
  if (!firebase) return Response.json(NEW_PAGE);

  const page = await firebase.firestore
    .collection("pages")
    .withConverter(firebase.pageConverter)
    .doc(encodeURIComponent(path))
    .get();

  if (firebase.exists(page)) {
    return Response.json(page.data());
  }

  return Response.json(NEW_PAGE);
}

export async function POST(
  request: Request,
  { params: { path: segments = [] } }: Params
) {
  const path = "/" + segments.join("/");
  const firebase = await getFirebase();
  if (!firebase) return Response.json(NEW_PAGE);

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
    await page.ref.set(NEW_PAGE);

    return Response.json(NEW_PAGE);
  }
}
