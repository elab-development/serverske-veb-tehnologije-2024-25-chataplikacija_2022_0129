import { Attachment } from '../types'
import { Download, File, Image, Music, Paperclip, Video } from 'lucide-react';

interface AttachmentProps {
    attachment: Attachment,
}

const AttachmentComponent = (prop: AttachmentProps) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image': return <Image />;
            case 'video': return <Video />;
            case 'audio': return <Music />;
            case 'document': return <File />;
            default: return <Paperclip />;
        }
    };

    return (
        <li className="list-row">
            <div className="text-white">
                {getFileIcon(prop.attachment.type)}
            </div>
            <div>
                <div className="text-white">{prop.attachment.name}</div>
                <div className="text-xs text-white uppercase font-semibold opacity-60">{formatFileSize(prop.attachment.size)}</div>
            </div>
            
            <a href={prop.attachment.url} download={prop.attachment.name} target="_blank" rel="noopener noreferrer" className="btn btn-square">
                
                    <Download/>
            </a>
        </li>
    )
}

export default AttachmentComponent