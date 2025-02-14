import * as UserService from "../../database/services/user.js"
import express, { Request, Response } from 'express';
import { User } from "../../models/user.js"
import bodyParser from "body-parser";

export const userRoute = express.Router();

const jsonParser = bodyParser.json();

userRoute.post("/api/v1/login", jsonParser, async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.login(req.body.username, req.body.password) as User;
    console.log(user.role);
    res.json(user);
    // res.send("donkey!");
});

userRoute.post("/api/v1/create-user", jsonParser, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserService.createUser(req.body.email, req.body.username, req.body.password, req.body.role);
        console.log(user.email);
        res.json(user);
        
    // res.send("donkey!");
    } catch (error) {
        return await error;
    } 
    
});