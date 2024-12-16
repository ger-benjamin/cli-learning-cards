import { CliLearningCards } from "./cli-learning-cards.js";

const sourcePath = new URL("../../data/source.json", import.meta.url);
const clc = new CliLearningCards(sourcePath);
clc.run();