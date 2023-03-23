class Service:
    def __init__(self, name, location):
        self.name = name
        self.location = location

    def __repr__(self):
        return "Service(%s, %s)" % (self.name, self.location)

    def __eq__(self, other):
        return isinstance(other, Service) and self.name == other.name and self.location == other.location

    def __hash__(self):
        return hash(self.__repr__())
