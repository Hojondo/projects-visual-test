// @ts-nocheck
// 树
import Lodash from "lodash";
/**
 * 二叉树 普通
 */
class TreeNode {
  public data: number;
  public leftChild: TreeNode | null = null;
  public rightChild: TreeNode | null = null;

  constructor(d: number) {
    this.data = d;
    return this;
  }

  public print() {
    console.log(this.data);
  }
}

/**
 * 这里只讨论 二叉搜索树
 * 二叉搜索树要求：
 * 若它的左子树不空，则左子树上所有结点的值均 小于/等于(其实一般不考虑有重复值的树) 它的根结点的值；
 * 若它的右子树不空，则右子树上所有结点的值均 大于 它的根结点的值；
 * 它的左、右子树也分别为二叉排序树。
 */
class Tree {
  constructor(public root: TreeNode) {}

  protected toNode(d: number) {
    return new TreeNode(d);
  }
  /**
   * 中序遍历:左子树——》根节点——》右子树
   * 遍历树是根据一种特定的顺序访问树的每一个节点。比较常用的有前序遍历，中序遍历和后序遍历。而二叉搜索树最常用的是中序遍历。
   * @returns
   */
  public traverseMid(
    flagCurrent = this.root,
    cb = (n: TreeNode) => {
      console.log(n.data);
    }
  ) {
    if (!flagCurrent) return;
    this.traverseMid(flagCurrent.leftChild || null);
    cb && cb(flagCurrent);
    this.traverseMid(flagCurrent.rightChild || null);
  }
  /**
   * 前序遍历:根节点——》左子树——》右子树
   * 遍历树是根据一种特定的顺序访问树的每一个节点。比较常用的有前序遍历，中序遍历和后序遍历。而二叉搜索树最常用的是中序遍历。
   * @returns
   */
  public traversePre() {
    return 2;
  }
  /**
   * 后序遍历:左子树——》右子树——》根节点
   * 遍历树是根据一种特定的顺序访问树的每一个节点。比较常用的有前序遍历，中序遍历和后序遍历。而二叉搜索树最常用的是中序遍历。
   * @returns
   */
  public traverseAft() {
    return 2;
  }

  public find(d: number) {
    // let flagParent: TreeNode | null = null;
    // 取消上行代码，对于目标为root的特例，将parent赋值为自身 可减少后续delete二次判断特例的逻辑
    let flagCurrent = this.root;

    while (flagCurrent) {
      if (d < flagCurrent.data) {
        flagCurrent = flagCurrent.leftChild;
      } else if (d > flagCurrent.data) {
        flagCurrent = flagCurrent.rightChild;
      } else {
        return flagCurrent;
      }
    }
    return null;
  }

  public findWithParent(d: number) {
    // let flagParent: TreeNode | null = null;
    // 取消上行代码，对于目标为root的特例，将parent赋值为自身 可减少后续delete二次判断特例的逻辑
    let flagCurrent = this.root;
    let parentNode: undefined | TreeNode;
    let positionAsChild: undefined | "leftChild" | "rightChild";

    while (flagCurrent) {
      if (d < flagCurrent.data) {
        parentNode = flagCurrent;
        positionAsChild = "leftChild";

        flagCurrent = flagCurrent.leftChild;
      } else if (d > flagCurrent.data) {
        parentNode = flagCurrent;
        positionAsChild = "rightChild";

        flagCurrent = flagCurrent.rightChild;
      } else {
        return {
          ...flagCurrent,
          parentNode,
          positionAsChild,
        };
      }
    }
    return null;
  }

  public findMax() {
    let flagCurrent = this.root;
    while (flagCurrent) {
      const flagNext = flagCurrent.rightChild;
      if (flagNext) {
        flagCurrent = flagNext;
      } else {
        return flagCurrent;
      }
    }
    return flagCurrent;
  }
  public findMin() {
    let flagCurrent = this.root;
    while (flagCurrent) {
      const flagNext = flagCurrent.leftChild;
      if (flagNext) {
        flagCurrent = flagNext;
      } else {
        return flagCurrent;
      }
    }
    return flagCurrent;
  }
  public insert(d: number) {
    if(this.find(d)) return null;
    const newNode = this.toNode(d);

    let flagCurrent = this.root;
    while (flagCurrent) {
      if (d < flagCurrent.data || d === flagCurrent.data) {
        const flagNext = flagCurrent.leftChild;

        if (!flagNext) {
          // 左子 没有 则说明没有比它还小的，直接插入为左子
          flagCurrent.leftChild = newNode;
          return Object.assign(newNode, { parentNode: flagCurrent });
        }
        flagCurrent = flagNext;
      } else {
        const flagNext = flagCurrent.rightChild;
        if (!flagNext) {
          flagCurrent.rightChild = newNode;
          return Object.assign(newNode, { parentNode: flagCurrent });
        }
        flagCurrent = flagNext;
      }
    }
    return null;
  }
  public delete(d: number) {
    const res = this.findWithParent(d);
    if (!res) return null; // 没找到

    const { leftChild, rightChild, parentNode, positionAsChild } = res;

    // x节点 无child 或 只有一个child
    if (!(leftChild && rightChild)) {
      const successor = leftChild || rightChild;
      if (!parentNode) {
        // 0. 特殊处理，根节点
        this.root = successor;
      } else {
        parentNode[positionAsChild!] = successor;
      }
    } else {
      // 目标节点有两个child
      // 某个节点的 次高节点 是它的 中序遍历后继节点，即 parent.rightChild 的findMin()

      // 1. 找到 改后继节点 successor
      const rightTree = new Tree(rightChild);
      const successor = rightTree.findMin();

      // 2. 后继节点-左右子 赋值为 原来x的左右子
      if (successor !== rightChild) {
        rightTree.delete(successor.data); // 先从子树中删掉继承者
        successor.rightChild = rightChild; // 再把继承者放到原本位置，先后顺序很重要
      }
      successor.leftChild = leftChild;

      // 3. x.parent 的左/右子 指向 后继节点
      if (!parentNode) {
        // 0. 特殊处理，根节点
        this.root = successor;
      } else {
        parentNode[positionAsChild!] = successor;
      }
    }
    return res;
  }
}

// 平衡二叉树（Balanced Binary Tree）又被称为AVL树，且具有以下性质：
// 它是一 棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。
// 这个方案很好的解决了二叉查找树退化成链表的问题，把插入，查找，删除的时间复杂度最好情况和最坏情况都维持在O(logN)。
// 但是频繁旋转会使插入和删除牺牲掉O(logN)左右的时间，不过相对二叉查找树来说，时间上稳定了很多。

/**
 * 红黑 二叉树
 * 1. 每个节点要么是红色，要么是黑色。
 * 2. 根节点是黑色。
 * 3. 每个叶子节点（NIL 节点，即空节点）是黑色。（叶子节点不存储数据，但在树中起到了重要的辅助作用。）
 * 4. 如果一个节点是红色，则它的两个子节点都是黑色。（不能有两个上下相邻的红色节点，因为这会破坏树的黑平衡性）（没有要求 不能有连续的黑色节点）
 * 5. 从任一节点到其每个叶子节点的所有路径都包含相同数目的黑色节点。（这保证了树的最长路径不超过最短路径的两倍，从而保持了树的平衡性。）
 *
 */
export class RBTreeNode extends TreeNode {
  public colorIsBlack = false; // 是否为黑，概念上强调 黑色数量作为平衡基准，弱化红色和未定义颜色为同一处理
  public parentNode: RBTreeNode | null = null;
  public leftChild: RBTreeNode | null = null;
  public rightChild: RBTreeNode | null = null;
  constructor(d: number | TreeNode) {
    super(d instanceof TreeNode ? d.data : d);
    if (d instanceof TreeNode) {
      this.leftChild = new RBTreeNode(d.leftChild);
      this.rightChild = new RBTreeNode(d.rightChild);
    }
  }
}
export class RedBlackTree extends Tree {
  public declare root: RBTreeNode;
  constructor(r: RBTreeNode) {
    super(r);
    this.root.colorIsBlack = true; // 初始 root 节点是黑色
  }

  protected toNode(d: number) {
    return new RBTreeNode(d);
  }
  public declare find: (d: number) => RBTreeNode | null;

  /**
   * 左旋 操作，将树左倾，x.right 升格为 x
   * @param xNode 基于哪个节点进行旋转
   */
  private rotateLeft(xNode: RBTreeNode) {
    const originalRight = xNode.rightChild;
    const originalRightsLeft = xNode.rightChild.leftChild;
    const originalParent = xNode.parentNode; // 位置不变

    // 1. 改 p
    if (originalParent) {
      const childType =
        originalParent.leftChild === xNode ? "leftChild" : "rightChild";
      originalParent[childType] = originalRight;
      originalRight.parentNode = originalParent;
    } else {
      this.root = originalRight;
      originalRight.parentNode = null;
    }

    // 2. 改 or
    originalRight.leftChild = xNode;
    // 2.5 改 or.l
    originalRightsLeft && (originalRightsLeft.parentNode = xNode);

    // 3. 改 x
    xNode.parentNode = originalRight;
    xNode.rightChild = originalRightsLeft;
  }
  /**
   * 右旋 操作，将树右倾，x.left 升格为 x
   * @param xNode 基于哪个节点进行旋转
   */
  private rotateRight(xNode: RBTreeNode) {
    const originalLeft = xNode.leftChild;
    const originalLeftsRightChild = xNode.leftChild.rightChild;
    const xParent = xNode.parentNode;

    // 1. 改 p
    if (xParent) {
      const childType =
        xParent.leftChild === xNode ? "leftChild" : "rightChild";
      xParent[childType] = originalLeft;
      originalLeft.parentNode = xParent;
    } else {
      this.root = originalLeft;
      originalLeft.parentNode = null;
    }
    // 2. 改 ol
    originalLeft.rightChild = xNode;

    // 2.5 改 ol.r
    originalLeftsRightChild && (originalLeftsRightChild.parentNode = xNode);

    // 3. 改 x
    xNode.parentNode = originalLeft;
    xNode.leftChild = originalLeftsRightChild;
  }

  public insert(d: number) {
    const treeNode = super.insert(d);
    if (!treeNode) return null;

    this.fixAfterInsert(treeNode as RBTreeNode);

    return treeNode;
  }

  /**
   * 修复平衡
   * https://segmentfault.com/a/1190000020118044 红黑树的 insert 操作 部分讲解
   * https://www.cnblogs.com/zhenbianshu/p/8185345.html (通过 234树 理解 红黑树)
   * @returns
   */
  private fixAfterInsert(newNode: RBTreeNode) {
    let xNode = newNode;
    // 如果 父节点是黑，会直接跳过while逻辑，不需要fix;
    // 父节点是红的情况下:
    while (xNode.parentNode && !xNode.parentNode.colorIsBlack) {
      const targetParent = xNode.parentNode;
      // 1. 先判断 父 是左 或 右
      if (!targetParent.parentNode) {
        console.log(targetParent);

        // _父是 root 的话 直接循环完毕
        // 理论上 这种情况下(xNode.parentNode as root).colorIsNotBlack 一定是 false 不会进入循环。其实可省略
        targetParent.colorIsBlack = true;
        break;
      }

      const unclePosition =
        targetParent === targetParent.parentNode.leftChild
          ? "rightChild"
          : "leftChild";
      const targetUncle = targetParent.parentNode[unclePosition];

      // 2. 判断 uncle 为红的话，只需要变色 不需要旋转
      if (targetUncle && !targetUncle.colorIsBlack) {
        // 2.1 则直接将 parent & uncle 变黑，
        targetUncle.colorIsBlack = true;
        targetParent.colorIsBlack = true;
        // 2.1 有 parent.parent 的话，将其 颜色反转，同时向上递归执行 fix 逻辑
        if (targetParent.parentNode !== this.root) {
          targetParent.parentNode.colorIsBlack =
            !targetParent.parentNode.colorIsBlack;
        }
        xNode = targetParent.parentNode;
        continue;
      }
      // 3. 父红叔黑 - 以下 分 4种情况 进行旋转
      // 3.1【父左】uncle 在右 / 或没有 uncle
      if (targetParent === targetParent.parentNode.leftChild) {
        // 3.2 判断 x 是左 或 右
        // 【左左】右旋 x.p.p ，直接将父节点 提起来：x.parent 变为 x.parent.parent的位置，x.parent.parent 变色 且为 x.parent.rightChild
        if (xNode === targetParent.leftChild) {
          const oPc = targetParent.colorIsBlack;
          const oGc = targetParent.parentNode.colorIsBlack;
          targetParent.colorIsBlack = !oPc;
          targetParent.parentNode.colorIsBlack = !oGc;
          this.rotateRight(targetParent.parentNode);
          continue;
        }
        // 【左右】左旋 x.p ，后变为 左左情况，应用左左逻辑
        else {
          this.rotateLeft(targetParent);
          xNode = targetParent; // 旋转后 父变为 x.leftChild 作为下一轮主角继续向上递归
          continue;
        }
      } else {
        // 3.1【父右】uncle 在左
        // 【右右】左旋 x.p.p 直接将父节点 提起来：x.parent 变为 x.parent.parent的位置，x.parent.parent 变色 且为 x.parent.leftChild
        if (xNode === targetParent.rightChild) {
          const oPc = targetParent.colorIsBlack;
          const oGc = targetParent.parentNode.colorIsBlack;
          targetParent.colorIsBlack = oGc;
          targetParent.parentNode.colorIsBlack = oPc;
          this.rotateLeft(targetParent.parentNode);
          continue;
        }
        // 【右左】右旋 x.p 变为 右右情况，应用右右逻辑
        else {
          this.rotateRight(targetParent);
          xNode = targetParent; // 旋转后 父变为 x.leftChild 作为下一轮主角继续向上递归
          continue;
        }
      }
    }
    return newNode;
  }

  // // todo
  // public delete(d: number) {
  //   const targetTreeNode = super.delete(d);
  //   if (!targetTreeNode) return null;
  //   const targetNode = new RBTreeNode(targetTreeNode);
  //   return Object.assign(targetNode);
  // }
}

// type XX = InstanceType<typeof RedBlackTree>
// const a: XX;
// a.root
export default function Test() {
  const resArr = [];

  let tree: null | RedBlackTree = null;

  const add = (d: number) => {
    if (!tree) {
      const root = new RBTreeNode(d);
      tree = new RedBlackTree(root);
    } else {
      if(!tree.insert(d)) return;
    }
    resArr.push(Lodash.cloneDeep(tree));
  };
  return {
    add,
    tree,
    getHistory(){
      return resArr
    },
  };
}
