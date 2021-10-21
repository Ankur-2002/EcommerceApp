const Delete = btn => {
  //   const prodId = btn.parentNode.querySelector(['id=prodId']);
  const id = btn.parentNode.querySelector('[id=prodId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const article = btn.closest('article');
  console.log(article);
  fetch('/admin/delete-product/' + id, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then(res => {
      //   console.log(res);
      return res.json();
    })
    .then(res => {
      article.parentNode.removeChild(article);
    })
    .catch(er => {
      console.log(er);
    });
};
