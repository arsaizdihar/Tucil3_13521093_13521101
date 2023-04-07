n = int(input("Number of nodes: "))
names = []
for i in range(n):
    names.append(input(f"Node {i+1}: "))

adj_mat = [["-" for _ in range(n)] for _ in range(n)]

for i in range(n):
    for j in range(i+1, n):
        weight = input(f"Weight between {names[i]} and {names[j]}: ")
        adj_mat[i][j] = weight
        adj_mat[j][i] = weight

filename = input("File output: ")
with open(filename, "w") as f:
    f.write(str(n))
    f.write("\n")
    f.write("\n".join(names))
    f.write("\n")
    for line in adj_mat:
        f.write(" ".join(line))
        f.write("\n")

        