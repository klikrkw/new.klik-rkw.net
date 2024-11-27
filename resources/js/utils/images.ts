import Resizer from "react-image-file-resizer";

export function resizeImage(
    file: File,
    newWidth: number,
    newHeight: number
): Promise<File> {
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
            file,
            newWidth,
            newHeight,
            "jpeg",
            100,
            0,
            (uri) => {
                resolve(uri as File);
            },
            "file"
        );
    });
}
