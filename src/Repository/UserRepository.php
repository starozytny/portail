<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

class UserRepository
{
    /**
     * @var Connection The database connection
     */
    private $connection;

    /**
     * The constructor.
     *
     * @param Connection $connection The database connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws Exception
     */
    public function getUser($username): array
    {
        $query = $this->connection->createQueryBuilder();

        return $query
            ->select('id', 'username', 'first_name')
            ->from('users')
            ->where('username = :username')
            ->setParameter(':username', $username)
            ->execute()
            ->fetchAllAssociative()
        ;
    }
}