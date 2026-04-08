import { describe, expect, it } from 'vitest';
import { api } from '../src/core/http/api';

describe('aPI 测试', () => {
    it('应该获取所有文章', async () => {
        const response = await api.posts.getAll();
        expect(response.code).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
    });

    it('应该获取单个文章', async () => {
        const response = await api.posts.getById(1);
        expect(response.code).toBe(200);
        expect(response.data.id).toBe(1);
        expect(response.data.title).toBeTruthy();
    });

    it('应该创建新文章', async () => {
        const newPost = {
            userId: 1,
            title: '测试标题',
            body: '测试内容',
        };
        const response = await api.posts.create(newPost);
        expect(response.code).toBe(201);
        expect(response.data.title).toBe('测试标题');
        expect(response.data.id).toBeGreaterThan(0);
    });

    it('应该更新文章', async () => {
        const updatedData = {
            title: '更新后的标题',
        };
        const response = await api.posts.update(1, updatedData);
        expect(response.code).toBe(200);
        expect(response.data.title).toBe('更新后的标题');
    });

    it('应该删除文章', async () => {
        const response = await api.posts.delete(1);
        expect(response.code).toBe(200);
    });

    it('应该获取所有用户', async () => {
        const response = await api.users.getAll();
        expect(response.code).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
    });

    it('应该获取单个用户', async () => {
        const response = await api.users.getById(1);
        expect(response.code).toBe(200);
        expect(response.data.id).toBe(1);
        expect(response.data.name).toBeTruthy();
    });

    it('应该获取文章的评论', async () => {
        const response = await api.comments.getByPostId(1);
        expect(response.code).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });
});
