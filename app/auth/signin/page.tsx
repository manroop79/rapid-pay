"use client"; // Mark this file as a Client Component

import { signIn } from "next-auth/react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; 
import styles from './signin.module.css'; // Import the CSS module for signin page styles
import authStyles from '../auth.module.css'; // Import the CSS module for auth background

export default function SignInPage() { 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => { 
        e.preventDefault(); 

        const res = await signIn("credentials", {
            redirect: false,
            email, 
            password 
        });

        if (res?.error) {
            setError(res.error)
        } else {
            router.push("/home")
        }
    };

    return ( 
        <div className={authStyles.authBackground}> 
            <div className={styles.container}>
                <h1 className="text-2xl">Sign In</h1> {/* Move the heading outside the form container */}
                <div className={styles.formContainer}>
                    {error && <p className={styles.error}>{error}</p>}
                    <form onSubmit={handleSignIn}>
                        <label> Email: 
                            <input 
                            type="email"
                            placeholder="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className={styles.input}
                            /> 
                        </label> 
                        <br />
                        <label> Password: 
                            <input
                            placeholder="password"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className={styles.input}
                            /> 
                        </label> 
                        <br /> 
                        <button type="submit" className={styles.button}>Sign In with Email</button> 
                    </form>
                    <hr />
                    <div className={styles.alternativeSignin}>
                        <p>Or</p>
                        <button onClick={() => signIn('github')} className={styles.button}>Sign In with Github</button>
                    </div>
                    <p className={styles.signupLink}>
                        Don&apos;t have an account?<Link href="/auth/signup">Sign Up here</Link>
                    </p>
                </div> 
            </div> 
        </div> 
    ); 
}