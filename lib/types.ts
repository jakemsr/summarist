import { User } from "firebase/auth";


export interface FirebaseUserResult {
    user: User | null;
    message: string;
}

export enum AuthenticationType {
    none,
    userLogin,
    guestLogin,
    userSignup,
    googleLogin,
    resetPassword
}

export enum UserSubscription {
    basic = "Basic",
    premium = "premium",
    plus = "premium-plus"
}

export type BookStatus = "selected" | "recommended" | "suggested";

export interface Book {
    id: string;
    author: string;
    title: string;
    subTitle: string;
    imageLink: string;
    audioLink: string;
    totalRating: number;
    averageRating: number;
    keyIdeas: number;
    type: "Audio" | "Text" | "Audio & Text";
    status: BookStatus;
    subscriptionRequired: boolean;
    summary: string;
    tags: string[];
    bookDescription: string;
    authorDescription: string;
}

export enum FontSize {
    small,
    medium,
    large,
    xlarge
}

export interface Library {
    savedBooks: string[];
    finishedBooks: string[];
}

export enum LibraryTypes {
    saved,
    finished
}

export enum LibraryChange {
    add,
    remove
}
