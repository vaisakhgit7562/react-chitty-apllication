import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { API_BASE_URL, headers_formdata } from '../../constants/apiContants.js';
import { withRouter } from "react-router-dom";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from "formik";
import * as Yup from "yup";

function RegistrationForm(props) {
    const [state, setState] = useState({
        successMessage: null

    });
    const ImageThumb = ({ image }) => {
        return <img src={URL.createObjectURL(image)} style={{ width: "170px", height: "170px" }} className="img-thumbnail" alt={image.name} />;
    };
    const [file, setFile] = React.useState("");

    function handleUpload(event) {
        setFile(event.target.files[0]);
    }
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const formik = useFormik({
        initialValues: {
            full_name: "",
            email: "",
            password: "",
            confirm_password: "",
            dob: "",
            address: "",
            photo: "",
            phone: "",
        },
        validationSchema: Yup.object({
            full_name: Yup.string()
                .min(2, "Mininum 2 characters")
                .max(15, "Maximum 15 characters")
                .required("Required!"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Required!"),
            password: Yup.string()
                .min(8, "Minimum 8 characters")
                .required("Required!"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "Password's not match")
                .required("Required!"),
            dob: Yup.date().default(function () {
                return new Date();
            }),
            address: Yup.string()
                .min(10, "Minimum 10 characters")
                .required("Required!"),
            //    photo: Yup.mixed().required(),
            phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Required!"),


        }),
        onSubmit: data => {
            let formData = new FormData();
            formData.append('userName', data.full_name);
            formData.append('userPassword', data.password);
            formData.append('userEmail', data.email);
            formData.append('userPhone', data.phone);
            formData.append('userAddress', data.address);
            formData.append('userDob', data.dob);
            formData.append('userPhoto', file);
            axios.post(API_BASE_URL + 'signup', formData, headers_formdata)
                .then(function (response) {
                    if (response.data.status === 'success') {

                        setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Registration successful. Redirecting to home page..'
                        }))
                        redirectToHome();
                        props.showError(null)
                    } else {
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (err) {
                    if (err.response) {
                        props.showError(err.response.data.message);
                        // client received an error response (5xx, 4xx)
                    } else if (err.request) {
                        props.showError("Some error ocurred");
                        // client never received a response, or request never left
                    } else {
                        // anything else
                        props.showError("Some error ocurred");
                    }
                });
        }

    });
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login');
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputNmae1">Name</label>
                    <input type="text"
                        className="form-control"
                        id="full_name"
                        placeholder="User Name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.full_name && formik.touched.full_name && (
                        <p className="error">{formik.errors.full_name}</p>
                    )}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.email && formik.touched.email && (
                        <p className="error">{formik.errors.email}</p>
                    )}
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={formik.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <p className="error">{formik.errors.password}</p>
                    )}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password"
                        className="form-control"
                        id="confirm_password"
                        placeholder="Confirm Password"
                        value={formik.confirm_password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.confirm_password && formik.touched.confirm_password && (
                        <p className="error">{formik.errors.confirm_password}</p>
                    )}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Phone</label>
                    <input type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Phone"
                        value={formik.phone}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.phone && formik.touched.phone && (
                        <p className="error">{formik.errors.phone}</p>
                    )}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Address</label>
                    <textarea
                        className="form-control"
                        id="address"
                        placeholder="Address"
                        value={formik.address}
                        onChange={formik.handleChange}
                    ></textarea>
                    {formik.errors.address && formik.touched.address && (
                        <p className="error">{formik.errors.address}</p>
                    )}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Dob</label>
                    <input type="date"
                        className="form-control"
                        id="dob"
                        max={moment().format("YYYY-MM-DD")}
                        placeholder="Date of Birth"
                        value={formik.dob}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.dob && formik.touched.dob && (
                        <p className="error">{formik.errors.dob}</p>
                    )}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Photo</label>
                    <input type="file"
                        className="form-control"
                        id="photo"
                        placeholder="Photo"
                        onChange={handleUpload}
                    />
                    {formik.errors.photo && formik.touched.photo && (
                        <p className="error">{formik.errors.photo}</p>
                    )}
                    {file && <ImageThumb image={file} />}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Register
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span>
            </div>

        </div>
    )
}

export default withRouter(RegistrationForm);