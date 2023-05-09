import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        // User serverAuth to check if user is logged in
        const { currentUser } = await serverAuth(req, res)
        return res.status(200).json(currentUser);
    } catch (error) {
        // console.log(error);
        return res.status(400).send({ error: 'Can not get current user data.' });
    }
}