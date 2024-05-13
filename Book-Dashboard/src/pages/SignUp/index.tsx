// import React from "react";
// import { useNavigate } from 'react-router-dom';
// import { FaGoogle } from "react-icons/fa";
// import { Button,  Form, Input, Alert, Select } from 'antd';
// import { Link } from "react-router-dom";
// import styles from './SignUp.module.css'
// import useAuth from "../../hooks/useAuth";
// import { axiosClient } from "../../library/axiosClient";


// interface DataType{
//   name: string,
//   email: string,
//   phonenumber: number,
//   gender: string,
//   address: string,
//   password: string
// }


// const SignupPage = () => {
//   const {login, isLoading} = useAuth();
//   const [msg, setMsg] = React.useState("")
//   const navigate = useNavigate();

//   const onFinish = async (values: any) => {
//     console.log('Success:', values);

//     try {
//       //Dùng hàm login ở store để login
//       const res =  await login(values.email, values.password);

//       console.log(res);
//       if(res.isAuthenticated) {
//         navigate('/'); //Login thanh cong thi chuyen huong qua dashboad
//       }else{
//         setMsg(res.error);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onFinishFailed = (errorInfo: any) => {
//     console.log('Failed:', errorInfo);
//   };


//     return(
//         <div className={styles.main_wrapper}>
//         <section data-section-id="1" data-share="" data-category="sign-up" data-component-id="6c5b97a6_10_awz" className={styles.wrapper}>
//           <div className={styles.header_relavite}>
//             <img className={styles.thumbnail} src="../../../public/images/background-gradient-color.png" alt="" data-config-id="auto-img-1-10" />
//             <div className={styles.wrapper_container}>
//               <div className={styles.form_container}>
//                 <h2 className={styles.h2_font} data-config-id="auto-txt-1-10">Sign up to your account</h2>
//                 <p className={styles.title_form} data-config-id="auto-txt-2-10">Greetings on your return! We kindly request you to enter your details.</p>
//                 <Form onFinish={onFinish}
//                     onFinishFailed={onFinishFailed}
//                     autoComplete="off">

//                   <Form.Item<DataType>
//                     name="name"
//                     rules={[{ required: true, message: 'Please input your Name!' }]}
//                     className={styles.form_bar}
//                   >
//                     <label className={styles.label_bar}>Name</label>
//                     <Input className={styles.input_bar} placeholder="Enter your name" />
//                   </Form.Item>
                  
//                   <Form.Item<DataType>
//                     name="phonenumber"
//                     rules={[{ required: true, message: 'Please input your Phone number!' }]}
//                     className={styles.form_bar}
//                   >
//                     <label className={styles.label_bar}>Phone Number</label>
//                     <Input  className={styles.input_bar} placeholder="Enter your phone number" />
//                   </Form.Item>

//                   <Form.Item<DataType>
//                     name="email"
//                     rules={[{ required: true, message: 'Please input your email!' }]}
//                     className={styles.form_bar}
//                   >
//                     <label className={styles.label_bar}>Email</label>
//                     <Input  className={styles.input_bar} placeholder="Enter your eamil" />
//                   </Form.Item>

//                   <Form.Item<DataType> name="gender" className={styles.form_bar}
//                   rules={[{ required: true, message: 'Please choice gender!' }]}
//                   >
//                   <label className={styles.label_bar}>Gender</label>
//                       <Select
//                         options={[
//                           {
//                             label: 'Male',
//                             value: 'Male',
//                           },
//                           {
//                             label: 'Female',
//                             value: 'Female',
//                           },
//                           {
//                             label: 'Others',
//                             value: 'Others',
//                           },
//                         ]}
//                       />
//                     </Form.Item>
    
//                   <Form.Item<DataType>
//                     name="address"
//                     rules={[{ required: true, message: 'Please input your address!' }]}
//                     className={styles.form_bar}
//                   >
//                     <label className={styles.label_bar}>Address</label>
//                     <Input id="address" name="address" className={styles.input_bar} placeholder="Enter your address" />
//                   </Form.Item>

//                   <Form.Item<DataType>
//                      hidden
//                     name="password"
//                     rules={[{ required: true, message: 'Please input your password!' }]}
//                     className={styles.form_bar}
//                   >
//                     <label className={styles.label_bar}>Password</label>
//                     <Input
//                      id="password" name="password" className={styles.input_bar} placeholder="Enter your password" />
//                   </Form.Item>


//                     <Form.Item >
                    
//                     <Button className={styles.btn_submit}  htmlType="submit" disabled={isLoading}>
//                      <div className={styles.btn_trains}></div>
//                       <span className={styles.namebtn}>
//                       {isLoading ? 'Submitting...' : 'Login'}
//                       </span>
//                     </Button>
//                   </Form.Item>
//                   <a className={styles.social_gg} href="#">
//                     <span><FaGoogle /></span>
//                     <span className={styles.social_title} data-config-id="auto-txt-8-10">Login with Google</span>
//                   </a>
//                   <div className={styles.bottom}>
//                     <span className={styles.content}>
//                       <span data-config-id="auto-txt-9-10">Already have an account?</span>
//                       <a className={styles.next_link} href="#" data-config-id="auto-txt-10-10">Sign in</a>
//                     </span>
//                   </div>
//                 </Form>
//               </div>
//             </div>
//           </div>
//         </section>
  
//       </div>
//     )
// }

// export default SignupPage