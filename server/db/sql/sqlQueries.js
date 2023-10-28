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

    questions: {
        create: sql('questions/create.sql'),
        add: sql('questions/add.sql'),
        delete: sql('questions/delete.sql'),
        findAll: sql('questions/findAll.sql'),
        drop: sql('questions/drop.sql'),
    }
    
};

export default queries;