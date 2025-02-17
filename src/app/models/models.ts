export interface Word{
    id : string;
    word : string;
    category : string;
}

export interface Score{
    id : string;
    playerName : string;
    word : string;
    attemptsLeft : number;
    score : number;
    date: Date;
    idGame: string;
}

export interface User{
    id : string;
    username : string;
    password : string;
    role : string;
    name : string
}