const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('dist'));
});

gulp.task('migrate', function() {
  console.log("starting migration...")
  require('dotenv').load();
  const node_config = require('node-config-ts');
  console.log("config:" + node_config.config.database_url);

  const Sequelize = require('sequelize');
  const snowden = require('./dist/server/models/Snowden');
  const snowdenQuery = require('./dist/server/models/SnowdenQuery');
  const problem = require('./dist/server/models/Problem');
  
  var seq = new Sequelize(node_config.config.database_url);
  seq.drop();
  snowdenQuery.SnowdenQuery.belongsTo(snowden.Snowden);
  snowden.Snowden.hasMany(snowdenQuery.SnowdenQuery);
  snowden.Snowden.sync({force: true}).then(res => {
  snowdenQuery.SnowdenQuery.sync({force: true}).then(res => {
      problem.Problem.sync({force: true}).then(res => {
      })
    })
  })
});

gulp.task('default', ['watch', 'assets']);