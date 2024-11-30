const API_URL = import.meta.env.VITE_API_URL

export const uploadFile = async (file, groupId, idToken) => {
    if (!file || !groupId || !idToken) {
        throw new Error('Missing required parameters');
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', groupId);

    const response = await fetch(`${API_URL}file/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${idToken}`,
        },
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
};