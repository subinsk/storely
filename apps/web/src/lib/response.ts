export default function sendResponse({
    data,
    message,
    success
}: {
    data: any,
    message: string,
    success: boolean
}) {
    return Response.json({
        success,
        message,
        data
    });
}