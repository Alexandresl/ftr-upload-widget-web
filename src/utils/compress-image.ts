interface CompressImageParams {
    file: File
    maxWidth?: number
    maxHeight?: number
    quality?: number
}

function convertToWepp(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.')

    if (lastDotIndex === -1) {
        return `${filename}.webp`
    }

    return `${filename.substring(0, lastDotIndex)}.webp`
}

export function compressImage({
    file,
    maxWidth = Number.POSITIVE_INFINITY,
    maxHeight = Number.POSITIVE_INFINITY,
    quality = 1,
}: CompressImageParams) {

    const allowedFileTypes = [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/bmp'
    ]

    if (!allowedFileTypes.includes(file.type)) {
        throw new Error('Image format not supported.')
    }


    return new Promise<File>((resolve, reject) => {

        const reader = new FileReader()

        reader.onload = event => {
            const compressed = new Image()

            compressed.onload = () => {
                const canvas = document.createElement('canvas')

                let width = compressed.width
                let heigth = compressed.height

                if (width > heigth) {
                    if (width > maxWidth) {
                        heigth *= maxWidth / width
                        width = maxWidth
                    }
                } else {
                    if (heigth > maxHeight) {
                        width *= maxHeight / heigth
                        heigth = maxHeight
                    }
                }

                canvas.width = width
                canvas.height = heigth

                const context = canvas.getContext('2d')

                if (!context) {
                    reject(new Error('Failed to get canvas context'))
                    return
                }

                context.drawImage(compressed, 0, 0, width, heigth)

                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            reject(new Error('Failed to compress image.'))
                            return
                        }

                        const compressedFile = new File(
                            [blob],
                            convertToWepp(file.name),
                            {
                                type: 'image/webp',
                                lastModified: Date.now()
                            }
                        )

                        resolve(compressedFile)

                    },
                    'image/webp',
                    quality
                )

            }

            compressed.src = event.target?.result as string
        }

        reader.readAsDataURL(file)
    })


}