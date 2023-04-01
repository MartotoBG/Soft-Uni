import { render, html } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';
import { put, get, del, post } from '../api.js';
const main = document.querySelectorAll('main')[0];

export async function fruitEdit(ctx) {
  const id = ctx.params.id;
  const item = await get(`/data/fruits/${id}`);
  render(edit(item), main);
}
async function onSubmit(event) {
  event.preventDefault();
  const id = event.target.getAttribute('fruit');
  const data = new FormData(event.target);
  const name = data.get('name');
  const imageUrl = data.get('imageUrl');
  const description = data.get('description');
  const nutrition = data.get('nutrition');
  if (name == "" || imageUrl == "" || description == "" || nutrition == "") {
    return alert('all fields are required!');
  }
  const editing = put(`/data/fruits/${id}`, { name, imageUrl, description, nutrition });
  page.redirect(`/details/${id}`);
}
const edit = (fruit) => html`
<section id="edit">
<div class="form">
  <h2>Edit Fruit</h2>
  <form class="edit-form" @submit=${onSubmit} fruit=${fruit._id}>
    <input type="text" name="name" id="name" placeholder="Fruit Name" .value=${fruit.name}/>
    <input type="text" name="imageUrl" id="Fruit-image" placeholder="Fruit Image URL" .value=${fruit.imageUrl}/>
    <textarea id="fruit-description" name="description" placeholder="Description" rows="10" cols="50" .value=${fruit.description}></textarea>
    <textarea id="fruit-nutrition" name="nutrition" placeholder="Nutrition" rows="10" cols="50" .value=${fruit.nutrition}></textarea>
    <button type="submit">post</button>
  </form>
</div>
</section>
`;