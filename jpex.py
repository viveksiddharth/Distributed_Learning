
from queue import PriorityQueue
def solve(x,y,p):
    
    n = max(x,y)
    m= min(x,y)
    temp1 = p//n
    t1 = p%n
    while temp1>=0:
        if t1%m==0:
            return temp1+ t1//m
        else:
            temp1-=1
            t1+=n
    return -1

print(solve(3,4,6))


        
        

        

    
