import pgPromise from 'pg-promise';
const { QueryFile } = pgPromise;

// Helper for linking to external query files
function sql(file) {
    const fullPath = new URL(file, import.meta.url).pathname; // generating full path;
    const currQueryFile =  new QueryFile(fullPath, {minify: true});
    if (currQueryFile.error) {
        console.error(currQueryFile.error);
    }

    return currQueryFile;
}

const queries = {
    users: {
        add: sql('users/add.sql'),
        delete: sql('users/delete.sql'),
        update: sql('users/update.sql'),
        find: sql('users/find.sql'),
    },
    questions: {
        add: sql('questions/add.sql'),
    },
    units: {
        add: sql('units/add.sql'),
    },
    topics: {
        add: sql('topics/add.sql'),
    },
    profile_pictures: {
        upsert: sql('profile_pictures/upsert.sql'),
        delete: sql('profile_pictures/delete.sql'),
    },
};

export default queries;
