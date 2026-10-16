import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {

  ArrowLeft,

  User,

  Mail,

  Phone,

  Calendar,

  MapPin,

  Briefcase,

  Building2,

  ShieldCheck,

  Save,

  Loader2,


  AlertCircle,

  CheckCircle2,

} from "lucide-react";

import "./index.css";



const MOCK_DOMAINS = [

  { id: 1, name: "Java" },

  { id: 2, name: "Python" },

  { id: 3, name: "React Js" },

  { id: 4, name: "Mern Stack" },

  { id: 5, name: "DevOps" },

  { id: 6, name: "DevScops" },

  { id: 7, name: "Data Analyst" },

  { id: 8, name: "Data Engineering" },

  { id: 9, name: "Data Science" },

];



function EditEmployee() {

  const navigate = useNavigate();

  const { id } = useParams();



  const [formData, setFormData] = useState({

    employeeId: "",

    fullName: "",

    email: "",

    phone: "",

    dateOfBirth: "",

    residentialAddress: "",

    permanentAddress: "",

    emergencyContactName: "",

    emergencyContactPhone: "",

    domain: "",

    employmentType: "",

    joiningDate: "",

    status: "ACTIVE",

  });



  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  /* =====================================================

     LOAD EMPLOYEE

     ===================================================== */





useEffect(() => {

  const fetchEmployee = async () => {

    try {

      setLoading(true);

      setError("");



   const token =

  localStorage.getItem("hirenestToken") ||

  localStorage.getItem("token") ||

  sessionStorage.getItem("hirenestToken") ||

  sessionStorage.getItem("token");



      if (!token) {

        setError("Please log in again.");

        return;

      }



      const response = await fetch(

        `http://localhost:8080/api/employees/${id}`,

        {

          method: "GET",

          headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",

          },

        }

      );



     if (response.status === 401 || response.status === 403) {

  throw new Error("Please log in again.");

}



if (!response.ok) {

  throw new Error(

    `Failed to load employee (${response.status})`

  );

}



const data = await response.json();



const employee = Array.isArray(data)

  ? data.find((item) => String(item.id) === String(id))

  : data;



if (!employee || String(employee.id) !== String(id)) {

  throw new Error("Employee not found");

}



setFormData({

  employeeId: employee.employeeId || "",

  fullName: employee.fullName || "",

  email: employee.email || "",

  phone: employee.phone || "",

  dateOfBirth: employee.dateOfBirth || "",

  residentialAddress: employee.residentialAddress || "",

  permanentAddress: employee.permanentAddress || "",

  emergencyContactName: employee.emergencyContactName || "",

  emergencyContactPhone: employee.emergencyContactPhone || "",

  domain: employee.domainName || employee.domain || "",

  employmentType: employee.employmentType || "",

  joiningDate: employee.joiningDate || "",

  status: employee.status || "ACTIVE",

});

    } catch (err) {

      console.error("Load employee error:", err);

      setError(err.message || "Unable to load employee.");

    } finally {

      setLoading(false);

    }

  };



  if (id) {

    fetchEmployee();

  } else {

    setError("Employee ID is missing.");

    setLoading(false);

  }

}, [id]);





  /* =====================================================

     HANDLE CHANGE

     ===================================================== */



  const handleChange = (event) => {

    const { name, value } = event.target;



    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));



    setError("");

    setSuccess("");

  };



  /* =====================================================

     SAVE CHANGES

     ===================================================== */





const handleSubmit = async (event) => {

  event.preventDefault();



  setError("");

  setSuccess("");



  if (

    !formData.employeeId.trim() ||

    !formData.fullName.trim() ||

    !formData.email.trim() ||

    !formData.phone.trim() ||

    !formData.domain ||

    !formData.employmentType ||

    !formData.joiningDate

  ) {

    setError("Please fill in all required fields.");

    return;

  }



  try {

    setSaving(true);



  const token =

  localStorage.getItem("hirenestToken") ||

  localStorage.getItem("token") ||

  sessionStorage.getItem("hirenestToken") ||

  sessionStorage.getItem("token");



    if (!token) {

      throw new Error("Please log in again.");

    }



    const payload = {

      employeeId: formData.employeeId.trim(),

      fullName: formData.fullName.trim(),

      email: formData.email.trim(),

      phone: formData.phone.trim(),

      dateOfBirth: formData.dateOfBirth || null,

      residentialAddress: formData.residentialAddress.trim(),

      permanentAddress: formData.permanentAddress.trim(),

      emergencyContactName: formData.emergencyContactName.trim(),

      emergencyContactPhone: formData.emergencyContactPhone.trim(),

      domainName: formData.domain,

      employmentType: formData.employmentType,

      joiningDate: formData.joiningDate,

      status: formData.status,

    };



    const response = await fetch(

      `http://localhost:8080/api/employees/${id}`,

      {

        method: "PUT",

        headers: {

          Authorization: `Bearer ${token}`,

          "Content-Type": "application/json",

        },

        body: JSON.stringify(payload),

      }

    );



    if (!response.ok) {

      const message = await response.text();

      throw new Error(

        message || `Update failed (${response.status})`

      );

    }



    setSuccess("Employee updated successfully.");



    setTimeout(() => {

      navigate("/employees");

    }, 1000);

  } catch (err) {

    console.error("Update employee error:", err);

    setError(err.message || "Unable to update employee.");

  } finally {

    setSaving(false);

  }

};





  /* =====================================================

     LOADING

     ===================================================== */



  if (loading) {

    return (

      <div className="edit-employee-page">

        <div className="edit-loading">

          Loading employee...

        </div>

      </div>

    );

  }



  /* =====================================================

     PAGE

     ===================================================== */



  return (

    <div className="edit-employee-page">



      {/* HEADER */}



      <div className="edit-header">



        <button

          className="edit-back-button"

          onClick={() =>

            navigate(

              `/employees/${id}`

            )

          }

        >

          <ArrowLeft size={17} />

          Back to Employee

        </button>



        <div>

          <span className="edit-eyebrow">

            Employee Management

          </span>



          <h1>

            Edit Employee

          </h1>



          <p>

            Update employee information

          </p>

        </div>



      </div>



      {/* CARD */}



      <div className="edit-card">



        <div className="edit-card-top">



          <div className="edit-title-icon">

            <User size={20} />

          </div>



          <div>

            <h2>

              Employee Profile

            </h2>



            <p>

              Update the employee information below.

            </p>

          </div>



        </div>



        <form onSubmit={handleSubmit}>



          {/* PERSONAL */}



          <section className="edit-section">



            <div className="edit-section-heading">



              <User size={18} />



              <div>

                <h3>

                  Personal Information

                </h3>



                <p>

                  Basic employee details

                </p>

              </div>



            </div>



            <div className="edit-grid">



              <div className="edit-field">

                <label>

                  Employee ID *

                </label>



                <div className="edit-input">

                  <Briefcase size={16} />



                  <input

                    type="text"

                    name="employeeId"

                    value={formData.employeeId}

                    onChange={handleChange}

                  />

                </div>

              </div>



              <div className="edit-field">

                <label>

                  Full Name *

                </label>



                <div className="edit-input">

                  <User size={16} />



                  <input

                    type="text"

                    name="fullName"

                    value={formData.fullName}

                    onChange={handleChange}

                  />

                </div>

              </div>



              <div className="edit-field">

                <label>

                  Email *

                </label>



                <div className="edit-input">

                  <Mail size={16} />



                  <input

                    type="email"

                    name="email"

                    value={formData.email}

                    onChange={handleChange}

                  />

                </div>

              </div>



              <div className="edit-field">

                <label>

                  Phone *

                </label>



                <div className="edit-input">

                  <Phone size={16} />



                  <input

                    type="tel"

                    name="phone"

                    value={formData.phone}

                    onChange={handleChange}

                  />

                </div>

              </div>



              <div className="edit-field">

                <label>

                  Date of Birth

                </label>



                <div className="edit-input">

                  <Calendar size={16} />



                  <input

                    type="date"

                    name="dateOfBirth"

                    value={formData.dateOfBirth}

                    onChange={handleChange}

                  />

                </div>

              </div>



              <div className="edit-field">

                <label>

                  Joining Date *

                </label>



                <div className="edit-input">

                  <Calendar size={16} />



                  <input

                    type="date"

                    name="joiningDate"

                    value={formData.joiningDate}

                    onChange={handleChange}

                  />

                </div>

              </div>



            </div>

          </section>



          {/* EMPLOYMENT */}



          <section className="edit-section">



            <div className="edit-section-heading">



              <Building2 size={18} />



              <div>

                <h3>

                  Employment Information

                </h3>



                <p>

                  Work and employment details

                </p>

              </div>



            </div>



            <div className="edit-grid">



              <div className="edit-field">



                <label>

                  Domain *

                </label>



                <div className="edit-input">



                  <Building2 size={16} />



                  <select

                    name="domain"

                    value={formData.domain}

                    onChange={handleChange}

                  >



                    <option value="">

                      Select Domain

                    </option>



                    {MOCK_DOMAINS.map(

                      (domain) => (

                        <option

                          key={domain.id}

                          value={domain.name}

                        >

                          {domain.name}

                        </option>

                      )

                    )}



                  </select>







                </div>



              </div>



              <div className="edit-field">



                <label>

                  Employment Type *

                </label>



                <div className="edit-input">



                  <Briefcase size={16} />



                  <select

                    name="employmentType"

                    value={

                      formData.employmentType

                    }

                    onChange={handleChange}

                  >



                    <option value="">

                      Select Employment Type

                    </option>



                    <option value="FULL_TIME">

                      Full Time

                    </option>



                    <option value="PART_TIME">

                      Part Time

                    </option>



                    <option value="INTERN">

                      Intern

                    </option>



                    <option value="CONTRACT">

                      Contract

                    </option>



                  </select>







                </div>



              </div>



              <div className="edit-field">



                <label>

                  Status

                </label>



                <div className="edit-input">



                  <ShieldCheck size={16} />



                  <select

                    name="status"

                    value={formData.status}

                    onChange={handleChange}

                  >



                    <option value="ACTIVE">

                      Active

                    </option>



                    <option value="INACTIVE">

                      Inactive

                    </option>



                    <option value="FORMER">

                      Former

                    </option>



                  </select>







                </div>



              </div>



            </div>

          </section>



          {/* ADDRESS */}
          <section className="edit-section">
            <div className="edit-section-heading">
              <MapPin size={18} />
              <div>
                <h3>Address Information</h3>
                <p>Residential and permanent address details</p>
              </div>
            </div>

            <div className="address-form-block">
              <h4>Residential Address</h4>
              <div className="edit-grid">
                <div className="edit-field full-edit-field">
                  <label>Address Line</label>
                  <textarea
                    name="residentialAddress"
                    value={formData.residentialAddress}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter house number, street, area"
                  />
                </div>
                <div className="edit-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="residentialCity"
                    value={formData.residentialCity}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
                <div className="edit-field">
                  <label>State</label>
                  <input
                    type="text"
                    name="residentialState"
                    value={formData.residentialState}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>
                <div className="edit-field">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="residentialPincode"
                    value={formData.residentialPincode}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter 6-digit PIN code"
                  />
                </div>
              </div>
            </div>

            <div className="address-form-block">
              <h4>Permanent Address</h4>
              <div className="edit-grid">
                <div className="edit-field full-edit-field">
                  <label>Address Line</label>
                  <textarea
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter house number, street, area"
                  />
                </div>
                <div className="edit-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="permanentCity"
                    value={formData.permanentCity}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
                <div className="edit-field">
                  <label>State</label>
                  <input
                    type="text"
                    name="permanentState"
                    value={formData.permanentState}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>
                <div className="edit-field">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="permanentPincode"
                    value={formData.permanentPincode}
                    onChange={handleChange}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="Enter 6-digit PIN code"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* EMERGENCY */}



          <section className="edit-section">



            <div className="edit-section-heading">



              <Phone size={18} />



              <div>

                <h3>

                  Emergency Contact

                </h3>



                <p>

                  Emergency contact information

                </p>

              </div>



            </div>



            <div className="edit-grid">



              <div className="edit-field">



                <label>

                  Contact Name

                </label>



                <div className="edit-input">



                  <User size={16} />



                  <input

                    type="text"

                    name="emergencyContactName"

                    value={

                      formData.emergencyContactName

                    }

                    onChange={handleChange}

                  />



                </div>



              </div>



              <div className="edit-field">



                <label>

                  Contact Phone

                </label>



                <div className="edit-input">



                  <Phone size={16} />



                  <input

                    type="tel"

                    name="emergencyContactPhone"

                    value={

                      formData.emergencyContactPhone

                    }

                    onChange={handleChange}

                  />



                </div>



              </div>



            </div>

          </section>



          {/* MESSAGES */}



          {error && (

            <div className="edit-message edit-error">

              <AlertCircle size={17} />

              {error}

            </div>

          )}



          {success && (

            <div className="edit-message edit-success">

              <CheckCircle2 size={17} />

              {success}

            </div>

          )}



          {/* BUTTONS */}



          <div className="edit-actions">



            <button

              type="button"

              className="edit-cancel"

              onClick={() =>

                navigate("/employees")

              }

              disabled={saving}

            >

              Cancel

            </button>



            <button

              type="submit"

              className="edit-save"

              disabled={saving}

            >



              {saving ? (

                <>

                  <Loader2

                    size={17}

                    className="edit-spinner"

                  />

                  Saving Changes...

                </>

              ) : (

                <>

                  <Save size={17} />

                  Save Changes

                </>

              )}



            </button>



          </div>



        </form>

      </div>

    </div>

  );

}



export default EditEmployee;