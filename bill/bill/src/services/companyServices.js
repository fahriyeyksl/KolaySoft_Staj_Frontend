import axios  from "axios";

export class CompanyServices {

    postCompanyAdd(data) {
        return axios.post("http://localhost:8080/api/customer/add", data)
    }

    postCompanyLogin = (data) => {
        //Veriler form-data olarak kabul ettiği için.
        const formData = new FormData();
        formData.append('customerEmail', data.CompanyEmail);
        formData.append('customerPassword', data.CompanyPassword);

        return axios.post("http://localhost:8080/api/customer/login", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }




}