module.exports = {
  '**/*.+(js|md|ts|css|sass|less|graphql|yml|yaml|scss|json)': [
    'prettier --write',
    'git add',
  ],
};
