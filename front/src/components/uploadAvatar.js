import axios from 'axios';
import { useContext, useRef } from 'react';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { UserContext } from '../context/userContext';

const UploadAvatar = ({ setUser }) => {
    const user = useContext(UserContext)
    const inputRef = useRef(null)

    const handleClick = () => {
        inputRef.current.click();
    }

    async function handleFileChange(e) {
        const file = e.target.files && e.target.files[0]
        let formData = new FormData();

        if (!file)
            return;
        const ext = file.name.split('.').pop();
        if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png')
            console.log('error: image extension not supported');
        else {
            formData.append('file', file, `${user.username}.avatar.jpg`);
            axios
                .post('http://localhost:3001/api/users/uploadAvatar', formData, {
                    withCredentials: true,
                })
                .then(response => setUser(response.data))
        }
    }

    return (
        <div className='upload'>
            <input
                style={{ display: 'none' }}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
            />
            <button onClick={handleClick}>Upload image</button>
        </div>
    )
}

export default UploadAvatar;