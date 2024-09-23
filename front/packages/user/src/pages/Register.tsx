import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@apollo/client";
import {passwordRegex, usernameRegex} from "@/utils/Miscellaneous.ts";
import {
    JoinUserInput,
    UsersetJoinUserDocument,
} from "@mnd/shared/src/types/userset/gql/graphql.ts";

const FormSchema = z.object({
    username: z.string().min(1, 'Please enter your ID.')
        .regex(usernameRegex, 'Only lowercase letters, numbers, and the special character (-) are allowed, and the length must be between 6 and 12 characters.'),
    firstName: z.string().min(1, 'Please enter your name.'),
    password: z.string()
        .min(6, 'Please enter a password with at least 6 characters.')
        .max(20, 'Please enter a password with 20 characters or less.')
        .regex(passwordRegex, 'Must include uppercase letters, lowercase letters, and special characters.'),
    passwordConfirm: z.string().min(6, 'Please enter a password with at least 6 characters.').optional(),
    email: z.string().min(1, 'Please enter your email.').email('The email format is incorrect.'),
})
    .partial()
    .refine((form) => form.password === form.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "The passwords do not match.",
    });

type FormType = z.infer<typeof FormSchema>;

const Register = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const [mutation] = useMutation(UsersetJoinUserDocument);

    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormType>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit: SubmitHandler<FormType> = (data) => {
        const payload = {
            username: data.username,
            firstName: data.firstName,
            email: data.email,
            password: data.password,
            groups: [],
            enabled: true
        } as JoinUserInput;

        console.log("payload", payload);

        mutation({
            variables: {input: payload}
        }).then(res => {
            const joinUser = res.data?.joinUser;
            if (joinUser?.__typename === "DefaultError") {
                setErrorMessage(joinUser.message);
            } else {
                navigate('/');
            }
        });
    }

    return (
        <main>
            <div className="register-wrapper">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="register-header">
                        <h1>Creat Account</h1>
                    </div>
                    <div className="register-content register-scrollbar">
                        {errorMessage && <div className="input-error">{errorMessage}</div>}

                        <div className="input-wrapper">
                            <label htmlFor="username"><span className="required-value">*</span>Username(ID)</label>
                            <input type="text" id="username(ID)"
                                   placeholder="Enter the username(characters between 6~20)"
                                   {...register("username")}
                                   required/>
                            {errors.username && <div className="input-error">{errors.username.message}</div>}
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password"><span className="required-value">*</span>Password</label>
                            <input type="password" id="password"
                                   placeholder="Enter the password(characters between 6~20)"
                                   {...register("password")}
                                   required/>
                            {errors.password && <div className="input-error">{errors.password.message}</div>}
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password"><span className="required-value">*</span>Password Confirm</label>
                            <input type="password" id="password"
                                   placeholder="Enter the same as password"
                                   {...register("passwordConfirm")}
                                   required/>
                            {errors.passwordConfirm && <div className="input-error">{errors.passwordConfirm.message}</div>}
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password"><span className="required-value">*</span>Name</label>
                            <input type="text" id="password"
                                   placeholder="Enter the nickname"
                                   {...register("firstName")}
                                   required/>
                            {errors.firstName && <div className="input-error">{errors.firstName.message}</div>}
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password"><span className="required-value">*</span>E-Mail</label>
                            <input type="email" id="password" placeholder="user@gaia3d.com" {...register("email")} required/>
                            {errors.email && <div className="input-error">{errors.email.message}</div>}
                        </div>
                    </div>
                    <div className="register-button">
                        <button type="submit"  className="button-login">Join in</button>
                    </div>

                </form>
            </div>
        </main>
    )
}

export default Register;