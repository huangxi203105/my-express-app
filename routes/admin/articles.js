const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");
/**
 * 获取文章列表
 * GET　/admin/articles
 */
router.get("/", async (req, res) => {
  try {
    const query = req.query;
    const currentPage = Number(query.currentPage) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const offset = (currentPage - 1) * pageSize;
    const condition = {
      order: [["id", "DESC"]],
      limit: pageSize,
      offset,
    };
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`,
        },
      };
    }
    const { count, rows } = await Article.findAndCountAll(condition);
    success(res, "文章列表获取成功", {
      articles: rows,
      pagination: {
        currentPage,
        pageSize,
        total: count,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询文章详情
 * GET　/admin/articles:id
 */
router.get("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    success(res, "文章详情获取成功", { article });
  } catch (error) {
    failure(res, error);
  }
});
/**
 * 创建文章
 * POST　/admin/articles
 */
router.post("/", async (req, res) => {
  try {
    //白名单过滤
    const body = filterBody(req);
    const article = await Article.create(body);
    success(res, "文章创建成功", { article }, 201);
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 删除文章
 * DELETE　/admin/articles/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    await article.destroy();
    success(res, "文章删除成功");
  } catch (error) {
    failure(res, error);
  }
});
/**
 * 更新文章
 * PUT　/admin/articles/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const article = await getArticle(req);
    const body = filterBody(req);
    await article.update(body);
    success(res, "文章更新成功", { article });
  } catch (error) {
    failure(res, error);
  }
});
async function getArticle(req) {
  const { id } = req.params;
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFoundError(`ID: ${id} 的文章不存在`);
  } else {
    return article;
  }
}
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}
module.exports = router;
