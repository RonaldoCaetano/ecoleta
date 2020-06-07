import React, { useCallback, useState, FunctionComponent } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'

interface ImageDropZoneProps {
    onFileUploaded: (file: File) => void
}

const ImageDropZone: FunctionComponent<ImageDropZoneProps> = ({ onFileUploaded }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('')

	const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        const fileUrl = URL.createObjectURL(file)

        setSelectedFileUrl(fileUrl)
        onFileUploaded(file)
    }, [onFileUploaded])
    
	const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' })

	return (
		<div className="dropzone" {...getRootProps()}>
			<input {...getInputProps()} accept="ïmage/*" />

            {selectedFileUrl ? (
                <img src={selectedFileUrl} alt="Imagem selecionada" />
            ) : (
                <p>
                    <FiUpload />
                    Imagem do estabelicmento
                </p>
            )}

		</div>
	)
}

export default ImageDropZone
