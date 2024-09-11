const generateCloudinarySignature = async (public_id: string, timestamp: string, apiSecret: string): Promise<string> => {
    const strToSign = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(strToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default generateCloudinarySignature; 