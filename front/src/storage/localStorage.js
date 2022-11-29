

export function getStorageItem (name) {
    const saved = localStorage.getItem(name);
    const initialValue = JSON.parse(saved);

    return initialValue || null;
}

export function saveStorageItem(name, item) {
    localStorage.setItem(name, JSON.stringify(item));
}

export function getSocketId(socketId) {
    const savedId = localStorage.getItem('socketId')

    if (!savedId) {
        return socketId
    }
    console.log('save id ', savedId)
    return savedId
}