import numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from scipy import ndimage
import os, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
font_manager.fontManager.addfont("/System/Library/Fonts/Hiragino Sans GB.ttc")
plt.rcParams.update({
    "font.family": "Hiragino Sans GB", "axes.unicode_minus": False,
    "figure.facecolor": "#fcfaf5", "axes.facecolor": "#fcfaf5",
    "savefig.facecolor": "#fcfaf5", "text.color": "#34312d",
    "axes.labelcolor": "#34312d", "xtick.color": "#676157", "ytick.color": "#676157",
    "axes.edgecolor": "#d8d1c4", "font.size": 11,
})
INK, ACC, BLUE, RED, GREY = "#34312d", "#81582c", "#3d6a8a", "#b0463c", "#a39b8c"
rng = np.random.default_rng(0)

def save(fig, name):
    fig.savefig(f"{OUT}/{name}", dpi=170, bbox_inches="tight")
    plt.close(fig)

# ---------- 图 1：旋转字形 = 4096 维里的一条闭合曲线 ----------
S = 64
glyph = np.zeros((S, S))
glyph[14:20, 16:48] = 1          # 「T」的横
glyph[20:50, 29:35] = 1          # 「T」的竖
glyph[44:50, 22:42] = 1          # 底座，打破对称
glyph = ndimage.gaussian_filter(glyph, 0.8)
angles = np.linspace(0, 360, 180, endpoint=False)
imgs = np.stack([ndimage.rotate(glyph, a, reshape=False, order=1) for a in angles])
X = imgs.reshape(len(angles), -1)
Xc = X - X.mean(0)
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
Z = Xc @ Vt[:3].T

fig = plt.figure(figsize=(12, 4.6))
gs = fig.add_gridspec(2, 5, width_ratios=[1, 1, 1, 1, 3.2], hspace=0.35, wspace=0.15)
show = [0, 15, 30, 45]
for k, i in enumerate(show):
    ax = fig.add_subplot(gs[0, k]); ax.imshow(imgs[i], cmap="gray_r"); ax.set_axis_off()
    ax.set_title(f"旋转 {angles[i]:.0f}°", fontsize=10)
mid = 0.5 * (imgs[0] + imgs[45])
noisy = np.clip(imgs[15] + 0.35 * rng.standard_normal((S, S)), -0.5, 1.5)
for k, (im, t) in enumerate([(mid, "0° 与 90° 像素平均"), (noisy, "30° + 高斯噪声")]):
    ax = fig.add_subplot(gs[1, k * 2:(k * 2) + 2]); ax.imshow(im, cmap="gray_r"); ax.set_axis_off()
    ax.set_title(t + "\n（不在流形上）", fontsize=10, color=RED)
ax = fig.add_subplot(gs[:, 4], projection="3d")
ax.plot(*np.vstack([Z, Z[:1]]).T, color=ACC, lw=2)
for i, c in zip(show, [INK] * 4):
    ax.scatter(*Z[i], color=INK, s=25)
    ax.text(*Z[i], f" {angles[i]:.0f}°", fontsize=9)
zmid = (mid.ravel() - X.mean(0)) @ Vt[:3].T
ax.scatter(*zmid, color=RED, s=40, marker="x")
ax.text(*zmid, " 像素平均", color=RED, fontsize=9)
ax.set_title("4096 维像素空间，投影到前 3 个主成分", fontsize=11)
ax.set_xticks([]); ax.set_yticks([]); ax.set_zticks([])
ax.xaxis.pane.fill = ax.yaxis.pane.fill = ax.zaxis.pane.fill = False
save(fig, "fig1-rotation-manifold.png")
var_ratio = (s[:3] ** 2).sum() / (s ** 2).sum()
print("PCA top-3 variance ratio", round(var_ratio, 3))

# ---------- 2D 螺旋数据 ----------
def spiral(n):
    t = np.sqrt(rng.uniform(0, 1, n)) * 3 * np.pi + 0.5 * np.pi
    return np.stack([t * np.cos(t), t * np.sin(t)], 1) / 5
data = spiral(2000)

def denoise(x, sigma, D=data):
    """理想去噪器 E[x0 | x]：以训练点为经验分布的精确 Tweedie 结果"""
    d2 = ((x[:, None, :] - D[None]) ** 2).sum(-1)
    w = np.exp(-(d2 - d2.min(1, keepdims=True)) / (2 * sigma ** 2))
    w /= w.sum(1, keepdims=True)
    return w @ D

def score(x, sigma):
    return (denoise(x, sigma) - x) / sigma ** 2

# ---------- 图 2：加噪把细线摊成厚带 ----------
sig = [0, 0.1, 0.3, 1.0]
fig, axs = plt.subplots(1, 4, figsize=(12, 3.3))
for ax, sg in zip(axs, sig):
    pts = data[:1500] + sg * rng.standard_normal((1500, 2))
    ax.scatter(*pts.T, s=2, color=ACC if sg == 0 else BLUE, alpha=0.6)
    ax.set_title(f"σ = {sg}", fontsize=12)
    ax.set_xlim(-2.4, 2.4); ax.set_ylim(-2.4, 2.4); ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
axs[0].set_title("σ = 0：数据只在这条线上", fontsize=11)
axs[-1].set_title("σ = 1：几乎是一团高斯", fontsize=11)
save(fig, "fig2-noise-thickens.png")

# ---------- 图 3：score 场，小噪声指向流形，大噪声指向均值 ----------
g = np.linspace(-2.2, 2.2, 15)
G = np.stack(np.meshgrid(g, g), -1).reshape(-1, 2)
fig, axs = plt.subplots(1, 3, figsize=(12, 4.2))
for ax, sg in zip(axs, [0.05, 0.3, 1.5]):
    den = denoise(G, sg)
    v = den - G
    ax.scatter(*data.T, s=1.5, color=ACC, alpha=0.5)
    ax.quiver(G[:, 0], G[:, 1], v[:, 0], v[:, 1], angles="xy", scale_units="xy",
              scale=1, width=0.0035, color=BLUE, alpha=0.85)
    ax.set_xlim(-2.4, 2.4); ax.set_ylim(-2.4, 2.4); ax.set_aspect("equal")
    ax.set_xticks([]); ax.set_yticks([])
    ax.set_title(f"σ = {sg}", fontsize=12)
axs[0].set_xlabel("小噪声：箭头落在最近的那段曲线上")
axs[1].set_xlabel("中噪声：落在几段曲线的加权平均处")
axs[2].set_xlabel("大噪声：几乎都指向数据整体均值")
save(fig, "fig3-score-field.png")

# ---------- 图 4：法向/切向分解（直线流形，解析 score） ----------
fig, ax = plt.subplots(figsize=(6.4, 3.6))
sg = 0.35
xs = np.linspace(-3, 3, 400)
ax.fill_between(xs, -2 * sg, 2 * sg, color=BLUE, alpha=0.08, label="加噪后概率主要集中的带（±2σ）")
ax.plot(xs, 0 * xs, color=ACC, lw=3, label="数据流形（横轴）")
# 沿轴密度：N(0,1) 的数据经加噪后为 N(0, 1+σ²)
for (px, py) in [(-1.8, 0.5), (0.4, 0.55), (1.6, -0.45), (-0.6, -0.6)]:
    tx = -px / (1 + sg ** 2); ny = -py / sg ** 2
    k = 0.12
    ax.annotate("", (px + k * tx, py), (px, py), arrowprops=dict(arrowstyle="->", color=GREY, lw=1.6))
    ax.annotate("", (px, py + k * ny), (px, py), arrowprops=dict(arrowstyle="->", color=RED, lw=1.6))
    ax.annotate("", (px + k * tx, py + k * ny), (px, py), arrowprops=dict(arrowstyle="->", color=INK, lw=2))
    ax.scatter(px, py, color=INK, s=18, zorder=5)
ax.plot([], [], color=RED, label=r"法向分量 $-y/\sigma^2$：拉回流形")
ax.plot([], [], color=GREY, label="切向分量：沿流形往更密处走")
ax.plot([], [], color=INK, lw=2, label="合成的 score")
ax.set_xlim(-3, 3); ax.set_ylim(-1.3, 1.3); ax.set_aspect("equal")
ax.set_xticks([]); ax.set_yticks([])
ax.legend(fontsize=8.5, loc="upper left", frameon=False, ncol=2, bbox_to_anchor=(0, -0.02))
ax.set_title(f"直线上的数据，σ = {sg}：箭头长度按 0.12×score 画", fontsize=11)
save(fig, "fig4-normal-tangent.png")

# ---------- 图 5：反向采样轨迹（概率流 ODE，理想 score） ----------
sigmas = np.geomspace(3.0, 0.01, 300)
x = 3.0 * rng.standard_normal((400, 2))
traj = [x.copy()]
for s0, s1 in zip(sigmas[:-1], sigmas[1:]):
    d = (x - denoise(x, s0)) / s0          # dx/dσ（VE 概率流 ODE）
    x = x + (s1 - s0) * d
    traj.append(x.copy())
traj = np.stack(traj)
fig, axs = plt.subplots(1, 2, figsize=(10, 4.6))
ax = axs[0]
for i in range(0, 400, 8):
    ax.plot(traj[:, i, 0], traj[:, i, 1], color=BLUE, lw=0.7, alpha=0.6)
ax.scatter(*traj[0, ::8].T, s=8, color=GREY, label="起点：纯噪声")
ax.scatter(*traj[-1, ::8].T, s=10, color=ACC, zorder=5, label="终点")
ax.set_xlim(-6, 6); ax.set_ylim(-6, 6); ax.set_aspect("equal"); ax.set_xticks([]); ax.set_yticks([])
ax.legend(frameon=False, fontsize=9, loc="lower left")
ax.set_title("σ 从 3 降到 0.01 的轨迹", fontsize=11)
ax = axs[1]
ax.scatter(*data.T, s=1.5, color=GREY, alpha=0.4, label="训练数据")
ax.scatter(*traj[-1].T, s=6, color=ACC, label="生成结果")
ax.set_xlim(-2.4, 2.4); ax.set_ylim(-2.4, 2.4); ax.set_aspect("equal"); ax.set_xticks([]); ax.set_yticks([])
ax.legend(frameon=False, fontsize=9, loc="lower left")
ax.set_title("终点全部落回螺旋上", fontsize=11)
save(fig, "fig5-reverse-trajectories.png")
dist = np.sqrt(((traj[-1][:, None] - data[None]) ** 2).sum(-1)).min(1)
print("final dist to data: median", np.median(dist), "max", dist.max())

# ---------- 图 6：逆问题里的「投影出流形」示意 ----------
fig, ax = plt.subplots(figsize=(6.6, 4.4))
t = np.linspace(-1.2, 1.6, 200)
curve = np.stack([t, 0.55 * t ** 2 - 0.2], 1)
ax.plot(*curve.T, color=ACC, lw=3, label="数据流形 M")
# 测量约束 {x : a·x = y}：一条直线
a = np.array([1.0, 1.0]) / np.sqrt(2); yv = 1.05
line_t = np.linspace(-1.6, 1.8, 2)
p0 = a * yv; dvec = np.array([-a[1], a[0]])
L = np.stack([p0 + s_ * dvec for s_ in line_t])
ax.plot(*L.T, color=BLUE, lw=2, ls="--", label="满足测量的集合  Ax = y")
x0 = np.array([-0.3, 0.55 * 0.09 - 0.2 + 0.02])           # 去噪估计，几乎在 M 上
xp = x0 + (yv - a @ x0) * a                                # 投影到测量集合
ax.scatter(*x0, color=INK, s=40, zorder=5); ax.text(x0[0] - 0.45, x0[1] - 0.18, r"去噪估计 $\hat{x}_0$", fontsize=10)
ax.annotate("", xp, x0, arrowprops=dict(arrowstyle="->", color=RED, lw=2))
ax.scatter(*xp, color=RED, s=40, zorder=5); ax.text(xp[0] - 1.05, xp[1] + 0.05, "硬投影后：\n满足测量，离开了 M", fontsize=10, color=RED)
# 交点：M ∩ {Ax=y}
f = lambda tt: (tt + 0.55 * tt ** 2 - 0.2) / np.sqrt(2) - yv
tt = np.linspace(0, 1.6, 4000); tstar = tt[np.argmin(np.abs(f(tt)))]
xs_ = np.array([tstar, 0.55 * tstar ** 2 - 0.2])
ax.scatter(*xs_, color=ACC, s=70, marker="*", zorder=6)
ax.text(xs_[0] + 0.14, xs_[1] - 0.05, "想要的解：\n既在 M 上又满足测量", fontsize=10, color=ACC)
ax.set_xlim(-1.4, 2.0); ax.set_ylim(-0.6, 1.9); ax.set_aspect("equal"); ax.set_xticks([]); ax.set_yticks([])
ax.legend(frameon=False, fontsize=9, loc="upper right")
ax.set_title("示意图：逆问题里只做数据一致性投影的问题", fontsize=11)
save(fig, "fig6-inverse-off-manifold.png")
print("done")
