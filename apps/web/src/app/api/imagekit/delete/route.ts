import { imagekit } from "@/lib";

export async function DELETE(req: Request) {
  try {
    const res = await req.json();

    const { fileId } = res;

    const response = await imagekit.deleteFile(fileId);

    return Response.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Failed to delete file",
    });
  }
}
