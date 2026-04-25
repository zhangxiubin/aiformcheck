import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Index from "./index.vue";

// 共享的 mock 函数
const incrementMock = vi.fn();
const increment2Mock = vi.fn();

// Mock pinia stores，返回包含共享 mock 函数的对象
vi.mock("@/stores/index", () => ({
  useCounterStore: () => ({
    doubleCount: 2,
    increment: incrementMock,
  }),
}));

vi.mock("./stores/home.store", () => ({
  useCounterStore2: () => ({
    doubleCount2: 4,
    increment2: increment2Mock,
  }),
}));

describe("Index Page", () => {
  beforeEach(() => {
    // 每次测试前清空调用记录，避免干扰
    incrementMock.mockClear();
    increment2Mock.mockClear();
  });

  it("renders static content correctly", () => {
    const wrapper = mount(Index, {
      global: {
        stubs: {
          Dialog: true,
          Select: true,
          "w-button": {
            template: "<button @click=\"$emit('click')\"><slot /></button>",
          },
        },
      },
    });

    expect(wrapper.text()).toContain("Yay! Welcome to spark ❤️ vue!");
    expect(wrapper.text()).toContain("双倍计数：2");
    expect(wrapper.text()).toContain("双倍计数2：4");
  });

  it("calls increment when first button is clicked", async () => {
    const wrapper = mount(Index, {
      global: {
        stubs: {
          Dialog: true,
          Select: true,
          "w-button": {
            template: "<button @click=\"$emit('click')\"><slot /></button>",
          },
        },
      },
    });

    const buttons = wrapper.findAll("button");
    await buttons[0].trigger("click");

    expect(incrementMock).toHaveBeenCalled();
  });

  it("calls increment2 when second button is clicked", async () => {
    const wrapper = mount(Index, {
      global: {
        stubs: {
          Dialog: true,
          Select: true,
          "w-button": {
            template: "<button @click=\"$emit('click')\"><slot /></button>",
          },
        },
      },
    });

    const buttons = wrapper.findAll("button");
    await buttons[1].trigger("click");

    expect(increment2Mock).toHaveBeenCalled();
  });
});
