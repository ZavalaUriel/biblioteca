module.exports = {
    apps: [
        {
            name: 'biblioteca-api',
            script: './dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 3003,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3003,
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true,
            merge_logs: true,
        },
    ],
};
