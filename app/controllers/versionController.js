const db = require('../config/dbConfig.js');

exports.getVersion = (request, response) => {
    const reqVersionSplit = request.body.version.split(".");
    db.pool.query('SELECT * FROM m_version', (error, results) => {
        if (error) {
            response.json({
                code: 400,
                message: error.message,
                error: error
            });
            return
        }
        var updateApps = false
        var message = "Aplikasi sudah version terbaru"

        let version = results[0].android_version;
        let versionSplit = version.split(".");
        for (const index in versionSplit) { 
            let reqVersion = parseInt(reqVersionSplit[index])
            let version = parseInt(versionSplit[index])
            if (reqVersion < version) {
                updateApps = true
                message = "Update aplikasi anda di playstore!"
            }
        }
        var data = {
            new_version_apps: version,
            update_apps: updateApps,
            force_update: results[0].force_update
        };
        response.json({
            code: 200,
            message: message,
            data: data
        });
    })
}