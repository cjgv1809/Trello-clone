// import openai from "@/openai";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     // Get the todos of the request
//     const { todos } = await request.json();

//     // communicate with the OpenAI API
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       temperature: 0.8,
//       n: 1,
//       stream: false,
//       messages: [
//         {
//           role: "system",
//           content:
//             "When responding, welcome the user to the app and say welcome to the Trello clone app made by Carlos. Limit the response to 200 characters.",
//         },
//         {
//           role: "user",
//           content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress, and done, then tell the user to have a productive day! Here's the todos: ${JSON.stringify(
//             todos
//           )}`,
//         },
//       ],
//     });

//     const { data } = response;

//     console.log("DATA IS", data);
//     console.log("DATA CHOICES IS", data.choices[0].message);

//     // Return the response
//     return NextResponse.json(data.choices[0].message);
//   } catch (error) {
//     console.log("ERROR IS", error);
//     return NextResponse.error();
//   }
// }
