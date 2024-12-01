export const getMulterConfig = async () => ({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
