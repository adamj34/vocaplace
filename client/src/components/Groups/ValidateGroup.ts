
type GroupData = {
    group_name: string;
    bio?: string;
    picture?: File;
};

export function ValidateGroup(data: GroupData, updated:boolean): string | null {
    const { group_name, bio, picture } = data;

    if ((!group_name && !updated) || (group_name && (group_name.length < 5 || group_name.length > 20))) {
        return "Group name must contain between 5 and 20 characters! Please enter a valid name."
    }

    if (bio && bio.length > 100) {
        return "Group description cannot contain more than 100 characters! Please enter a shorter description."
    }

    if (picture && picture.size > 1000000) {
        return "Picture file cannot be bigger than 1MB! Please upload a smaller file."
    }

    return null
};
