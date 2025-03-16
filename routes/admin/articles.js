const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
/**
 * 获取文章列表
 * GET　/admin/articles
 */
router.get("/", async (req, res) => {
  try {
    const condition = {
      order: [["id", "DESC"]],
    };
    const articles = await Article.findAll(condition);
    res.json({
      status: "success",
      data: { articles },
      message: "Articles fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      errors: [error.message],
      message: error.message,
    });
  }
});

/**
 * 查询文章详情
 * GET　/admin/articles:id
 */
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      res.json({
        status: "success",
        data: { article },
        message: "Article fetched successfully",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "文章不存在",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "文章查询失败",
    });
  }
});
module.exports = router;
