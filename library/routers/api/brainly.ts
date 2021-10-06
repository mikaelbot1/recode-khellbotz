import brainly from "brainly-scraper-v2";
import { QuestionBrainly, AnswerBrainly } from "../../typings";
import LirikLagu  from "./lirik";

export default class Brainly extends LirikLagu {
	constructor () {
		super();
	}
	public SearchBrainly = async (questions: string): Promise <{ question: QuestionBrainly, answers: AnswerBrainly[] }[]|null> => {
		return new Promise (async (resolve, reject) => {
			try {
				const Search: brainly = new brainly("id");
				const data: { question: QuestionBrainly, answers: AnswerBrainly[] }[] = await Search.search("id", questions);
				if (!data[0]) return resolve(null)
				return resolve(data);
			} catch (err) {
				return reject(err)
			}
		})
	}
}