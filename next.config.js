module.exports = {
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/cv',
                    destination: 'https://drive.google.com/file/d/1Zoe_x4r8KQ9EFOHE6_Uad98C0Q4jDKuc/view',
                },
            ],
        }
    },
}
