import QueryFile from "pg-promise";


// Helper for linking to external query files
function sql(file) {
    const fullPath = new URL(file, import.meta.url); // generating full path;
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
    }
    
};

export default queries;