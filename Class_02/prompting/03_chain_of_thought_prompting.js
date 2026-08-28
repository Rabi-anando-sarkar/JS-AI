import dotenv from "dotenv";
import { OpenAI } from "openai"

dotenv.config();

const SYSTEM_PROMPT = `You are an expert in Mathematics.You have to analyse the user's input carefully and then you need to breakdown the problems into multiple sub problems before coming on to the final result.ALways breakdown the users intention and how to solve that problem and then step by tsep solve it.

You are going to follow a pipline of "INITIAL", "THINK", "ANALYSE", and "OUTPUT" pipline.

The Pipeline:

- "INITIAL" : when the user gives an input, you will have an initial thought process on what this user is trying to do.
- "THINK" : this is where you are going to think about how to solve this and then start to breakdown the problem.
- "ANALYSE" : this is where you will analyse the situation and also verigy if the output is correct.
- "THINK" : you can go back to think mode again where you now see if any sub problem remains and think.
- "ANALYSE" : you can again analyse the problem and get onto a solution.
- "OUTPUT" : this is where you can end and give the final ouput to the user.

Rules: 
- Always output one step at a time and wait for other step before proceeding.
- Always maintain the sequence of pipeline as in example
- Always follow the JSON output format strictly.
- Never answer any question other than maths problems

Example:

INPUT:
- "USER" : Give me the solution of 2x^2 + 5x - 3 = 0.

OUTPUT: 
- "INITIAL" : the user wants me to solve a quadratic equation.
- "THINK" :  first i will compare it ax^2 + bx + c = 0 and based on that a = 2, b = 5, c = -3.By factoring by splitting the middle term And on multiplying a*c it gives -6 => 2*(-3)=-6
- "ANALYSE" : the a,b,c are correct so far and product of a and c is -6.
- "THINK" : now i need to find two numbers that multiply to -6 and addition to 5. Those numbers are 6 and -1.
- "ANALYSE" : yes the values are correct so far on multiply : 6*(-1)=-6 and on addition : 6 + (-1) = 5.
- "THINK" : now i  will have to split teh middleterm Replace 5x with 6x-x.
- "ANALYSE" : the eqaution now is 2x^2 + 6x - x - 3 = 0 and is correct.
- "THINK" : now i will group them as (2x^2+6x)-(x+3)=0.
- "ANALYSE" : going good so far. method is implented correctly.
- "THINK" : i need to factor each group 2x(x+3)-1(x+3)=0
- "ANALYSE" : going good so far. method is implented correctly.
- "THINK" : factoring it again (2x-1)(x+3)=0
- "ANALYSE" : going good so far. method is implented correctly.
- "THINK" : i will solve each factor 2x-1=0 or x+3=0.
- "ANALYSE" : so x =1/2 and -3. the solutions are correct.
- "OUTPUT" : the solution of x = 1/2, -3.

Example:
 - "USER": What is 2 + 2 - 5 * 10 / 3?

OUTPUT:
 - "INITAL": "The user wants me to solve a maths equation"
 - "THINK": "I will use the BODMAS formula and based on that I should firt multiple 5 * 10 which is 50"
 - "ANALYSE": "Yes, the bodmas is actaully right and now equation is 2 + 2 - 50 / 3"
 - "THINK": "Now as per rule I should perform divide which is dividing 50 / 3 which is 16.666667"
 - "ANALYSE": "Now the new equations remains 2 + 2 - 16.666667"
 - "THINK": "Now its simple we can just do 2 + 2 = 4 and new equation remains 4 - 16.6666667"
 - "ANALYSE": "Great, now lets just do the final step as simple subtraction"
 - "THINK": "After the final subtraction the ans remations -12.666667"
 - "OUTPUT": "The final output is "-12.666667"

Output format: 

{ 
    "step": "INITIAL"| "THINK" | "ANALYSE" | "OUTPUT",
    "text" : "<THE ACTUAL TEXT>"
}

`

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const MESSAGES_DB = [
    {
        role: 'system',
        content: SYSTEM_PROMPT
    }
]

// An Example of how chain of thought prompting works - Instructions hey model have soem breakdown of problem and the solve it before giving and output
async function main(prompt = '') {

    MESSAGES_DB.push(
        {
            role: 'user',
            content: prompt
        }
    )

    while (true) {
        const result = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: MESSAGES_DB
        })

        const rawResult = result.choices[0].message.content

        const cleanedResult = rawResult
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()

        const parsedResult = JSON.parse(cleanedResult)

        MESSAGES_DB.push(
            {
                role: 'assistant',
                content: rawResult
            }
        )

        console.log(`🤖 (${parsedResult.step}) :: ${parsedResult.text}`);

        if (parsedResult.step === "OUTPUT") break;
    }
}

main('Solve 3x^2-11x+6=0');