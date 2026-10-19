export function getOptimizedImageUrl(url: string): string {
  try {
    const imageUrl = new URL(url);

    if (imageUrl.hostname === "res.cloudinary.com") {
      imageUrl.pathname = imageUrl.pathname.replace(
        "/image/upload/",
        "/image/upload/w_600,q_auto,f_auto/",
      );
    }
    if (
      imageUrl.hostname === "upload.wikimedia.org" &&
      imageUrl.pathname.startsWith("/wikipedia/commons/") &&
      !imageUrl.pathname.includes("/thumb/")
    ) {
      const originalPath = imageUrl.pathname.replace(
        "/wikipedia/commons/",
        "/wikipedia/commons/thumb/",
      );

      const filename = imageUrl.pathname.split("/").pop();

      if (filename) {
        imageUrl.pathname = `${originalPath}/500px-${filename}`;
      }
    }
    if (
      imageUrl.hostname === "images.unsplash.com" ||
      imageUrl.hostname === "plus.unsplash.com"
    ) {
      imageUrl.searchParams.set("w", "600");
      imageUrl.searchParams.set("q", "75");
      imageUrl.searchParams.set("auto", "format");
    }
    if (imageUrl.hostname === "images.pexels.com") {
      imageUrl.searchParams.set("auto", "compress");
      imageUrl.searchParams.set("cs", "tinysrgb");
      imageUrl.searchParams.set("w", "600");
      imageUrl.searchParams.delete("h");
      imageUrl.searchParams.delete("dpr");
    }
    return imageUrl.toString();
  } catch {
    return url;
  }
}
