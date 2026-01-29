"use client";

export default function UploadPage() {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await fetch("/api/upload-url", {
      method: "POST",
      body: JSON.stringify({
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    const { uploadURL } = await res.json();

    await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    alert("Upload successful!");
  }

  return <input type="file" onChange={handleUpload} />;
}
