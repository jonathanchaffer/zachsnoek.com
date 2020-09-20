import React from "react";
import { withRouter } from "react-router-dom";
import { createProject } from "../../utils/api";
import ProjectForm from "./ProjectForm";

const NewProject = withRouter(({ history }) => {
    const onSubmit = async (formData) => {
        const response = await createProject(formData);

        if (response.ok) {
            history.push("/portfolio-manager");
        } else {
            // TODO: handle error
            console.log(response);
        }
    };
    return (
        <ProjectForm
            formTitle={"New Project"}
            submitButtonText={"Create Project"}
            onSubmit={onSubmit}
        />
    );
});

export default NewProject;
