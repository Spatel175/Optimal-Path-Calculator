import csv
import heapq
import sys
import time
import json


file = open('/home/sp_ws/chatgpt/BFS_distances/driving-distance-app/src/driving.csv', newline='')
lst = list(csv.reader(file, delimiter=","))
file.close()

file1 = open('/home/sp_ws/chatgpt/BFS_distances/driving-distance-app/src/straightline.csv', newline='')
lst1 = list(csv.reader(file1, delimiter=","))
file1.close()

class Problem:
    def __init__(self, initial, goal):
        self.initial = initial
        self.goal = goal
        self.expNodes = 1


class Node:

    def __init__(self, initial, path_cost=0, parent=None):
        self.state = initial
        self.path_cost = path_cost
        self.parent = parent
        self.value = 0

    def __lt__(self, other):
        return (self.value < other.value)

    def __gt__(self, other):
        return (self.value > other.value)


def expand(Problem, node):
    res = []
    size = len(lst[0])
    for i in range(size):
        if node.state == lst[0][i]:
            for x in range(size-1):
                if int(lst[i][x+1]) > 0:
                    Problem.expNodes += 1
                    res.append(Node(lst[x+1][0], node.path_cost +
                                    int(lst[i][x+1]), node))
            break
    return res


def goalRow(problem):
    size = len(lst1[0])
    for i in range(size):
        if problem.goal == lst1[0][i]:
            return i


def f(problem, pq, i):
    size = len(lst1[0])
    for x in pq:
        for j in range(size):
            if x.state == lst1[0][j+1]:
                x.value = int(lst1[i][j+1])     # h(n)
                break


def f1(problem, pq, i):
    size = len(lst1[0])
    for x in pq:
        for j in range(size):
            if x.state == lst1[0][j+1]:
                x.value = x.path_cost + int(lst1[i][j+1])  # f(n) = g(n) + h(n)
                break


def bfs(problem, f):
    problem.expNodes = 1
    gR = goalRow(problem)
    node = Node(problem.initial)
    frontier = []
    heapq.heappush(frontier, node)
    reached = dict({problem.initial: node.path_cost})
    while len(frontier) != 0:
        if len(frontier) > 1:
            f(problem, frontier, gR)
        node = heapq.heappop(frontier)
        # using the pop function to pick
        # either value calculated from h(n) or f(n)
        if problem.goal == node.state:
            return node
        res = expand(problem, node)
        for x in res:
            if reached.get(x.state) is None:
                reached.update({x.state: x.path_cost})
                heapq.heappush(frontier, x)
            else:
                reach_pathcost = int(reached.get(x.state))
                if x.path_cost < reach_pathcost:
                    reached.update({x.state: x.path_cost})
                    heapq.heappush(frontier, x)
    return None

def Reverse(lst):
   new_lst = lst[::-1]
   return new_lst
 


def solPath(Problem, op):
    if op is None:
        slnObj = {
            "ERROR": sys.argv
        }
    res1 = []
    cost = op.path_cost
    while op.parent is not None:
        res1.append(op.state)
        op = op.parent
    res1.append(op.state)
    slnObj = {
        "slnPath" : Reverse(res1),
        "throughStates" : (len(res1) + 1),
        "expNodes" : Problem.expNodes,
        "pathCost" : cost
        }
    return (slnObj)

def main(args=None):
    # Setting up arguments from stdin 
    if args is None:
        args = sys.argv[1:]
    try:
        arg = sys.argv[1]
    except IndexError:
        raise SystemExit("ERROR: Not enough or too many input arguments.")
    #print(arg[::-1])
    #print(sys.argv)

    ## Problem Asign
    p = Problem(sys.argv[1], sys.argv[2])

    ## Execution time var set-up
    # Greedy BFS
    start_time1 = time.perf_counter()
    op = bfs(p, f) 
    end_time1 = time.perf_counter()

    # A Star
    start_time2 = time.perf_counter()
    op1 = bfs(p, f1)
    end_time2 = time.perf_counter()

    gbfsTime = start_time1 - end_time1
    abfsTime = start_time2 - end_time2
    
    result = {
        "GBFS" : {"slnObj": solPath(p,op), "time" : gbfsTime}, 
        "ABFS" : {"slnObj": solPath(p,op1), "time" : abfsTime}
    }
    

    # print("GBFS")
    # print(solPath(p,op))
    # print("Execution time: ", (end_time1 - start_time1), "seconds")
    # print("")
    # print("A* Search")
    # print("")
    # solPath(p, op1)
    # print("Execution time: ", (end_time2 - start_time2), "seconds")

    jsonObj = json.dumps(result)
    print(jsonObj)


if __name__ == '__main__':
    main()


__all__ = ['greedy_bfs', 'astar']

