'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { resolve } = require('node:path');
const Hexo = require('hexo');
const generate = require('../themes/fluid/scripts/generators/index-generator');

test('homepage exists without posts and paginates when posts are added', async () => {
  const hexo = new Hexo(resolve(__dirname, '..'), { silent: true });
  await hexo.init();
  try {
    hexo.config.index_generator = { path: '', per_page: 2, order_by: '-date' };
    hexo.config.pagination_dir = 'page';
    const posts = hexo.model('Post');
    const empty = generate.call(hexo, { index_posts: posts.find({}) });
    assert.deepEqual(empty.map(route => route.path), ['']);
    assert.equal(empty[0].data.posts.length, 0);

    await posts.insert(Array.from({ length: 3 }, (_, index) => ({
      title: `Post ${index}`,
      slug: `post-${index}`,
      source: `_posts/post-${index}.md`,
      date: new Date(Date.UTC(2026, 0, index + 1)),
      published: true
    })));
    const pages = generate.call(hexo, { index_posts: posts.find({}) });
    assert.deepEqual(pages.map(route => route.path), ['', 'page/2/']);
    assert.deepEqual(pages.map(route => route.data.posts.length), [2, 1]);
    assert.equal(pages[0].data.posts.first().title, 'Post 2');
    assert.equal(pages[1].data.posts.first().title, 'Post 0');
  } finally {
    await hexo.exit();
  }
});
