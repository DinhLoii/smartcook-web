import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/utils/imageFallback.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } });
const { DEFAULT_RECIPE_IMAGE, getFallbackByKeyword, handleImageError, resolveRecipeImage } =
  await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const cases = [
  ['Cơm gà Teriyaki', 'chicken-teriyaki'],
  ['Bò bít tết bơ tỏi', 'steak-asparagus'],
  ['Salad cá hồi', 'salmon-salad'],
  ['Mì Ý sốt Bolognese', 'pasta-bolognese'],
  ['Gà rán giòn', 'crispy-chicken'],
];
for (const [name, file] of cases) {
  const expected = `/recipe-images/${file}.webp`;
  assert.equal(getFallbackByKeyword(name), expected);
  assert.ok(existsSync(new URL(`../public${expected}`, import.meta.url)), expected);
}
assert.ok(existsSync(new URL(`../public${DEFAULT_RECIPE_IMAGE}`, import.meta.url)));
assert.equal(getFallbackByKeyword('Canh chua cá hồi'), DEFAULT_RECIPE_IMAGE);
assert.equal(resolveRecipeImage(' https://example.invalid/photo.jpg '), 'https://example.invalid/photo.jpg');
assert.equal(resolveRecipeImage('https://example.invalid/nczyq5mqjoeoq6qcmt10'), DEFAULT_RECIPE_IMAGE);

const baseURI = 'http://localhost:5173/recipes/demo';
const image = { baseURI, src: 'https://example.invalid/failed.jpg' };
const fallback = getFallbackByKeyword('Bò bít tết');
handleImageError({ currentTarget: image }, fallback);
assert.equal(image.src, new URL(fallback, baseURI).href);
handleImageError({ currentTarget: image }, fallback);
assert.equal(image.src, new URL(DEFAULT_RECIPE_IMAGE, baseURI).href);
handleImageError({ currentTarget: image }, fallback);
assert.equal(image.src, new URL(DEFAULT_RECIPE_IMAGE, baseURI).href);
image.src = 'https://example.invalid/replacement.jpg';
handleImageError({ currentTarget: image }, fallback);
assert.equal(image.src, new URL(fallback, baseURI).href);

console.log('PASS local recipe images, missing sources, fallback order and reused image elements');
